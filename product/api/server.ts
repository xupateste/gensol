import shortid from "shortid";

import {Product} from "../types";
import schemas from "../schemas";

import {database, firestore} from "~/firebase/admin";
import {ClientTenant} from "~/tenant/types";

export default {
  list: async (tenant: ClientTenant["id"]): Promise<Product[]> => {
    return database
      .collection("tenants")
      .doc(tenant)
      .collection("products")
      .get()
      .then((snapshot) => snapshot.docs.map((doc) => ({...(doc.data() as Product), id: doc.id})))
      .then((products) => products.map((product) => schemas.client.fetch.cast(product)));
  },
  orders: async (tenant: ClientTenant["id"]) => {
    return database
      .collection("tenants")
      .doc(tenant)
      .collection("orders")
      .get()
      .then((snapshot) => snapshot.docs.map(doc => ({...(doc.data()), id: doc.id})))
      .then((orders) => orders.map((order) => order));
  },
  create: (tenant: ClientTenant["id"], product: Product) => {
    const casted = schemas.server.create.cast(product);

    return database
      .collection("tenants")
      .doc(tenant)
      .collection("products")
      .add(casted)
      .then((snapshot) => {
        const product: Product = {...casted, id: snapshot.id};

        return product;
      });
  },
  remove: (tenant: ClientTenant["id"], product: Product["id"]) =>
    database
      .collection("tenants")
      .doc(tenant)
      .collection("products")
      .doc(product)
      .delete()
      .then(() => product),
  remorder: (tenant: ClientTenant["id"], order) =>
    database
      .collection("tenants")
      .doc(tenant)
      .collection("orders")
      .doc(order)
      .delete()
      .then(() => order),
  update: (tenant: ClientTenant["id"], {id, ...product}: Product) => {
    const casted = schemas.server.update.cast(product);

    return database
      .collection("tenants")
      .doc(tenant)
      .collection("products")
      .doc(id)
      .update(casted)
      .then(() => casted);
  },
  updateorder: (tenant: ClientTenant["id"], order) => {
    return database
      .collection("tenants")
      .doc(tenant)
      .collection("orders")
      .doc(order.id)
      .update(order)
      .then(() => order);
  },
  upsert: (tenant: ClientTenant["id"], products: Product[]) => {
    const batch = database.batch();

    products.forEach((product) => {
      if (product.id) {
        const {id, ...formatted} = schemas.server.update.cast(product);

        batch.update(
          database.collection("tenants").doc(tenant).collection("products").doc(id),
          formatted,
        );

        return {id, ...formatted};
      } else {
        const formatted = schemas.server.create.cast(product);
        const docId = shortid.generate();

        batch.create(
          database.collection("tenants").doc(tenant).collection("products").doc(docId),
          formatted,
        );

        return {id: docId, ...formatted};
      }
    });

    return batch.commit().then(() => products);
  },

  hookorder: (tenant: ClientTenant["id"], order) => {
    //const casted = schemas.server.create.cast(product);
    // let now = ;
    // let dateMinusHours = firestore.Timestamp.fromMillis(now.toMillis() - (3600000*5));
    order['createdAt'] = firestore.Timestamp.now().seconds;
    order['checked'] = false;

    return database
      .collection("tenants")
      .doc(tenant)
      .collection("orders")
      .add(order)
      .then();
  },
};
