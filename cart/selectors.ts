import shortId from "shortid";

import {CartItem} from "./types";

import {Field} from "~/tenant/types";
import {getVariantsPrice} from "~/product/selectors";
import {formatPrice} from "~/i18n/selectors";

export function getTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + getPrice(item), 0);
}

export function getUnitPrice(item: CartItem): number {
  switch (item.product.type) {
    // Price should not be modified
    case "hidden":
    case "unavailable":
    case "ask": {
      return 0;
    }

    // Price depends only on the variants
    case "variant": {
      return getVariantsPrice(item.variants) * item.count;
    }

    // Sum total and variants
    default: {
      return (item.product.price + getVariantsPrice(item.variants));
    }
  }
}
export function getFormattedUnitPrice(item: CartItem): string {
  switch (item.product.type) {
    // This should never be shown
    case "hidden": {
      return "No disponible";
    }

    // No stock
    case "unavailable": {
      return "Sin stock";
    }

    // Ask price
    case "ask": {
      return "A consultar";
    }

    // Get price
    default: {
      return formatPrice(getUnitPrice(item));
    }
  }
}

export function getPrice(item: CartItem): number {
  switch (item.product.type) {
    // Price should not be modified
    case "hidden":
    case "unavailable":
    case "ask": {
      return 0;
    }

    // Price depends only on the variants
    case "variant": {
      return getVariantsPrice(item.variants) * item.count;
    }

    // Sum total and variants
    default: {
      return (item.product.price + getVariantsPrice(item.variants)) * item.count;
    }
  }
}

export function getFormattedPrice(item: CartItem): string {
  switch (item.product.type) {
    // This should never be shown
    case "hidden": {
      return "No disponible";
    }

    // No stock
    case "unavailable": {
      return "Sin stock";
    }

    // Ask price
    case "ask": {
      return "A consultar";
    }

    // Get price
    default: {
      return formatPrice(getPrice(item));
    }
  }
}

export function getCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.count, 0);
}

/*function _getFields(fields: Field[]) {
  if (!fields) return "";

  return fields
    .filter(({value}) => value)
    .map(({value}) => `${value.length > 4 ? value.toUpperCase().substring(0, 4).concat('…') : value.toUpperCase() }`);
}*/

function _getFields(fields: Field[]) {
  if (!fields) return "";

  return fields
    .filter(({title, value}) => title && value)
    .map(({title, value}) => `${title}: *${value}*`)
    .join("\n");
}

/*function _getPreferenceFooter(preference?: string) {
  if (!preference) return "";

  return `----------

Este es tu link de pago. _Una vez realizado envianos el número de operación_.
${preference}`;
}
*/
function _getItems(items: CartItem[]): string {
  return items
    .map(
      (item) =>
        `·${[
          `[x${item.count}] ~Cod.${item.product.code}`,
          ` ${(item.product.title).length > 27 ? (item.product.title).substring(0, 27).concat('…') : item.product.title}`,
          ` ${getFormattedPrice(item)} (P.U. ${getFormattedUnitPrice(item)})`.substring(0, 28),
        ]
          .filter(Boolean)
          .join("\n")}`,
    )
    .join("\n\n");
}

export function getMessage(
  items: CartItem[],
  orderId: string,
  fields?: Field[],
  preference?: string,
): string {
 // console.log(fields);
  console.log(preference);
  return (
    "\`\`\`\n" +
    `Order# ${orderId}` +
    "\n" +
    (fields ? _getFields(fields) + "\n" : "") +
    "-----------------------------" +
    "\n" +
    _getItems(items) +
    "\n" +
    "-----------------------------" +
    "\n" +
    ` Subtotal` +
    "\n" +
    ` ${getCount(items)} Item(s) -> ${formatPrice(getTotal(items))}`.substring(0, 28) +
    "\n" +
    "-----------------------------" +
    "\`\`\`" +
    "\n\n" +
    "*Total amount to pay*" + 
    "\n" +
    "*= "+ formatPrice(getTotal(items)) + "*" +
    "\n."
  );
}

export const getOrderId = () => {
  // Set characters
  shortId.characters("0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZÑ");

  // Generate order id
  return `${shortId.generate().slice(0, 4).toUpperCase()}`;
};
