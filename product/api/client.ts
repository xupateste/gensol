import {Product} from "../types";

import {ClientTenant} from "~/tenant/types";
import fetch from "~/utils/fetch";

export default {
  create: (tenant: ClientTenant["slug"], product: Product) =>
    fetch(
      "POST",
      `/api/tenant/${tenant}/product`,
      {product},
      {
        Authorization: window.localStorage.getItem("token"),
      },
    ),
  remove: (tenant: ClientTenant["slug"], product: Product["id"]) =>
    fetch("DELETE", `/api/tenant/${tenant}/product?product=${product}`, null, {
      Authorization: window.localStorage.getItem("token"),
    }),
  remorder: (tenant: ClientTenant["slug"], order) =>
    fetch("DELETE", `/api/tenant/${tenant}/order?order=${order}`, null, {
      Authorization: window.localStorage.getItem("token"),
    }),
  update: (tenant: ClientTenant["slug"], product: Partial<Product>) =>
    fetch(
      "PATCH",
      `/api/tenant/${tenant}/product`,
      {product},
      {
        Authorization: window.localStorage.getItem("token"),
      },
    ),
  updateorder: (tenant: ClientTenant["slug"], order) =>
    fetch(
      "PATCH",
      `/api/tenant/${tenant}/order`,
      {order},
      {
        Authorization: window.localStorage.getItem("token"),
      },
    ),
  upsert: (tenant: ClientTenant["slug"], products: Partial<Product>[]): Promise<Product[]> =>
    fetch(
      "PUT",
      `/api/tenant/${tenant}/product`,
      {products},
      {
        Authorization: window.localStorage.getItem("token"),
      },
    ),
  hookorder: (tenant: ClientTenant["slug"], order) =>
    fetch(
      "POST",
      `/api/tenant/${tenant}/order`,
      {order},
      {
        Authorization: window.localStorage.getItem("token"),
      },
    ),
};
