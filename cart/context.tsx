import React, {useEffect} from "react";
import shortid from "shortid";
import produce from "immer";

import {Product, Variant} from "../product/types";

import {CartItem, Context, State, Actions, Cart} from "./types";
import {getOrderId} from "./selectors";
import api from "./api";

import {useAnalytics} from "~/analytics/hooks";
import paymentApi from "~/payment/api/client";
import {useTenant} from "~/tenant/hooks";
import {Field} from "~/tenant/types";
import {isMercadoPagoSelected} from "~/tenant/selectors";

import apiClient from "~/product/api/client"; //added
import {getMessage} from "./selectors"; //added

import {useProducts} from "~/product/hooks";



interface Props {
  children: JSX.Element | JSX.Element[];
}

const CartContext = React.createContext({} as Context);

const CartProvider = ({children}: Props) => {
  const log = useAnalytics();
  const {phone, slug, mercadopago, hook} = useTenant();
  const tenant = useTenant();
  const [cart, setCart] = React.useState<Cart>({});
  const items = React.useMemo(() => [].concat(...Object.values(cart)), [cart]);

  const productsAll = useProducts();

  useEffect(() => {
    const cartItemsData:Cart = JSON.parse(localStorage.getItem('cartItems'))
    if (cartItemsData) {
      setCart(
        produce(() => {
          Object.keys(cartItemsData).forEach(function(key) {
            if(productsAll.find((_product) => _product.id === cartItemsData[key].product.id)) {
              cartItemsData[key].product.price = productsAll.find((_product) => _product.id === cartItemsData[key].product.id).price
              add(cartItemsData[key].product, cartItemsData[key].variants, cartItemsData[key].count, cartItemsData[key].note)
            }            
          });
        }),
      );
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cart)) 
  }, [cart])
  
  function add(product: Product, variants: Variant[], count: number = 1, note: string = "") {
    log.addToCart(product, variants, count);
    
    

    return setCart(
      produce((cart) => {
        const id = shortid.generate();
        //accumulate
        var foundDup = items.find(i => {
          return i.product.id === product.id
        })

        if (foundDup) {
          cart[foundDup.id].count += count
        } else {
          cart[id] = {
            id,
            variants,
            count,
            product,
            note,
          };
        }
      }),
    );
  }

  async function removeAll(): Promise<void> {
    return setCart(
      produce((cart) => {
        Object.keys(cart).forEach(function(key) {
          delete cart[key];
        });
      }),
    )
  }

  function remove(id: CartItem["id"]) {
    if (!cart[id]) return;

    log.removeFromCart(cart[id].product, cart[id].variants, cart[id].count + 1);

    return setCart(
      produce((cart) => {
        delete cart[id];
      }),
    );
  }

  function increase(id: CartItem["id"]) {
    if (!cart[id]) return;

    return setCart(
      produce((cart) => {
        cart[id].count++;
      }),
    );
  }

  function decrease(id: CartItem["id"]) {
    if (!cart[id]) return;

    if (cart[id].count === 1) {
      return remove(id);
    }

    return setCart(
      produce((cart) => {
        cart[id].count--;
      }),
    );
  }

  async function checkout(fields?: Field[]) {
    // We generate an order id
    const orderId = getOrderId();

    // Log to analytics
    log.checkout(orderId, items);

    if (mercadopago && isMercadoPagoSelected(fields)) {
      try {
        // We need to create the window reference before because Safari doesn't let us execute a window.open after an async operation
        let tab = window.open("", "_blank");
        // Create a preference for this items
        const preference = await paymentApi.create(slug, items, orderId);

        // If a webhook is configured, do a post to it
        if (hook) {
          api.hook(hook, {phone, items, orderId, fields, preference});
        }
        

        // Redirect the new tab to the corresponding url
        tab.location.href = api.checkout({phone, items, orderId, fields, preference});
      } catch (e) {
        // If we had an error log it to the console
        console.warn("Error generando preferencia de MercadoPago: ", e);
      }
    }

    // If a webhook is configured
    if (hook) {
      // Do a post to it
      api.hook(hook, {phone, items, orderId, fields});
    }
    
    apiClient
      .hookorder(tenant.id, {orderId: orderId, items: items, fields: fields, phone: phone, message: encodeURIComponent(getMessage(items, orderId, fields, ""))})
      .then()
      .catch(err => {console.log(err)})
    // added
    
    
    // If we don't have mercadopago configured and selected, redirect the user to whatsapp
    window.open(api.checkout({phone, items, orderId, fields}));
  }

  const state: State = {items, cart};
  const actions: Actions = {add, remove, checkout, increase, decrease, removeAll};

  return <CartContext.Provider value={{state, actions}}>{children}</CartContext.Provider>;
};

export {CartProvider as Provider, CartContext as default};
