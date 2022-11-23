import {NextApiResponse, NextApiRequest} from "next";

import api from "~/product/api/server";
//import {Product} from "~/product/types";
import {ClientTenant} from "~/tenant/types";
import sessionApi from "~/session/api/server";
//import schemas from "~/product/schemas";

interface PostRequest extends NextApiRequest {
  headers: {
    authorization: string;
  };
  query: {
    id: ClientTenant["id"];
  };
  body: {
    order: {};
  };
}


interface PatchRequest extends NextApiRequest {
  headers: {
    authorization: string;
  };
  query: {
    id: ClientTenant["id"];
  };
  body: {
    order: {};
  };
}

interface DeleteRequest extends NextApiRequest {
  headers: {
    authorization: string;
  };
  query: {
    order: string;
    id: ClientTenant["id"];
  };
}


export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const {
      query: {id},
      body: {order},
      headers: {},
    } = req as PostRequest;

    //console.log('post order called')
    //if (!id || !order) return res.status(304).end('noid noorder');

    //if (uid !== id) return res.status(403).end();
    //console.log('inside sessionApi')
    //const casted = schemas.client.create.cast(product, {stripUnkown: true});

    return api
      .hookorder(id, order)
      .then(() => res.status(200).json(order))
      .catch(() => res.status(400).end("Hubo un error creando la orden"));
  }

  if (req.method === "PATCH") {
    const {
      query: {id},
      body: {order},
      headers: {authorization: token},
    } = req as PatchRequest;

    if (!id || !order) return res.status(304).end();

    return sessionApi
      .verify(token)
      .then(({uid}) => {
        if (uid !== id) return res.status(403).end();

        return api
          .updateorder(id, order)
          .then(() => res.status(200).json(order))
          .catch((error) =>
            res.status(400).json({
              message: "Hubo un error actualizando la orden",
              details: error,
            }),
          );
      })
      .catch(() => res.status(401).end("La sesión expiró, vuelve a iniciar sesión para continuar"));
  }

  if (req.method === "DELETE") {
    const {
      query: {id, order},
      headers: {authorization: token},
    } = req as DeleteRequest;

    if (!id || !order) return res.status(304).end();

    return sessionApi
      .verify(token)
      .then(({uid}) => {
        if (uid !== id) return res.status(403).end();

        return api
          .remorder(id, order)
          .then(() => res.status(200).json({success: true}))
          .catch(() => res.status(400).end("Hubo un error borrando la orden"));
      })
      .catch(() => res.status(401).end("La sesión expiró, volvé a iniciar sesión para continuar"));
  }

  return res.status(304).end('return end');
};