/*import React from "react";
import {action} from "@storybook/addon-actions";

import mock from "../../mock";

import CartSummaryDrawer from "./CartSummaryDrawer";

import tenantMock from "~/tenant/mock";
// @ts-ignore
import {Product} from "~/product/types";//added

export const open = () => (
  <CartSummaryDrawer
    products= { [] as Product[]  }
    fields={tenantMock.client.full.fields}
    items={[mock.item]}
    onCheckout={() => {
      action("checkout");

      return Promise.resolve();
    }}
    onClose={action("close")}
    onDecrease={action("decrease")}
    onIncrease={action("increase")}
    onRemoveAll={() => {
      action("close");

      return Promise.resolve();
    }}
  />
);

export const manyItems = () => (
  <CartSummaryDrawer
    products= { [] as Product[] }
    fields={tenantMock.client.full.fields}
    items={[
      ...[mock.item, mock.item],
      ...[mock.item, mock.item],
      ...[mock.item, mock.item],
      ...[mock.item, mock.item],
      ...[mock.item, mock.item],
      ...[mock.item, mock.item],
    ]}
    onCheckout={() => {
      action("checkout");

      return Promise.resolve();
    }}
    onClose={action("close")}
    onDecrease={action("decrease")}
    onIncrease={action("increase")}
    onRemoveAll={() => {
      action("close");

      return Promise.resolve();
    }}
  />
);*/

export default {title: "Cart/Components/CartSummaryDrawer"};
