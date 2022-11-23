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

function _getFields(fields: Field[]) {
  if (!fields) return "";

  return fields
    .filter(({value}) => value)
    .map(({value}) => `${value.length > 4 ? value.toUpperCase().substring(0, 4).concat('…') : value.toUpperCase() }`);
}

/*
function _getFields(fields: Field[]) {
  if (!fields) return "";

  return fields
    .filter(({title, value}) => title && value)
    .map(({title, value}) => `${title}: *${value}*`)
    .join("\n");
}

function _getPreferenceFooter(preference?: string) {
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

function _getHeader() : string {
  return (
    "FERRISUR DISTRIBUIDORA" +
    "\n" +
    "Av. Modesto Borda 743 Juliaca" +
    "\n" +
    "Whatsapp 935687208" +
    "\n\n"
  )
}

function _getDiscount(stotal) : string {
  switch(true) {
    case (stotal < 500):
      return (
        "\n" +
        " Descuentos" +
        "\n" +
        " A consultar por interno" +
        "\n" +
        "-----------------------------" 
        );
    case (stotal < 1500):
      return (
        "\n" +
        " Descuento" +
        "\n" +
        " 2% Dcto ¡Ahorras "+formatPrice(stotal*0.02)+"!" +
        "\n" +
        "-----------------------------" 
        );
    case (stotal < 3200):
      return (
        "\n" +
        " Descuento" +
        "\n" +
        " 3% Dcto ¡Ahorras "+formatPrice(stotal*0.03)+"!" +
        "\n" +
        "-----------------------------"
        );
    case (stotal < 6000):
      return (
        "\n" +
        " Descuento" +
        "\n" +
        " 4% Dcto ¡Ahorras "+formatPrice(stotal*0.04)+"!" +
        "\n" +
        "-----------------------------"
        );
    default:
      return (
        "\n" +
        " Descuento" +
        "\n" +
        " 5% Dcto ¡Ahorras "+formatPrice(stotal*0.05)+"!" +
        "\n" +
        "-----------------------------"
        );
  }
}
function _getTotal(total) : string {
  switch(true) {
    case (total < 500):
      return (formatPrice(total));
    case (total < 1500):
      return (formatPrice(total*0.98));
    case (total < 3200):
      return (formatPrice(total*0.97));
    case (total < 6000):
      return (formatPrice(total*0.96));
    default:
      return (formatPrice(total*0.95));
  }
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
    _getHeader() +
    `Pedido#  : ${_getFields(fields)}-${orderId}` +
    "\n" +
    "-----------------------------" +
    "\n" +
    _getItems(items) +
    "\n" +
    "-----------------------------" +
    "\n" +
    ` Subtotal` +
    "\n" +
    ` ${getCount(items)} Item(s) a ${formatPrice(getTotal(items))}`.substring(0, 28) +
    "\n" +
    "-----------------------------" +
    _getDiscount(getTotal(items)) + 
    "\`\`\`" +
    "\n\n" +
    "*Monto Total A Pagar*" + 
    "\n" +
    /*`*${formatPrice(getTotal(items))}*` +*/
    "*= "+ _getTotal(getTotal(items)) +"*" +
    "\`\`\`" +
    //(fields ? "\n\n" + _getFields(fields) : "\n").substring(0, 27) +
    "\n\n" +
    "* Precios válidos por 7 días\n" +
    "* Los productos están sujetos\n" +
    "  a disponibilidad de stock\n" + 
    "\`\`\`"
  );
}

export const getOrderId = () => {
  // Set characters
  shortId.characters("0123456789abcdefghijklmnñopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZÑ");

  // Generate order id
  return `${shortId.generate().slice(0, 4).toUpperCase()}`;
};
