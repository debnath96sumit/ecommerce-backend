import {
  MessageType,
  CartEvent,
} from "../types";
import { productsDetailsMap } from "./EventDataStore";

export const HandleCartEvent = async (message: MessageType) => {
  console.log(`cartEvent received`, message);
  switch (message.event) {
    case CartEvent.GET_CARTS_REQUEST:
      console.log("Fetch product event received", message.data);
      break;
    case CartEvent.GET_PRODUCTS_RESPONSE:
      console.log("products response received", message.data);
      Object.entries(message.data.products).forEach(([key, value]) => {
        productsDetailsMap.set(key, value);
      });
      break;
    default:
      console.log("No event available for ", message.event);
  }
};
