import {
    MessageType,
    UserEvent,
  } from "../types";
import { productsDetailsMap } from "./EventDataStore";
  
export const HandleUserEvent = async (message: MessageType) => {
  console.log(`UserEvent received`, message);
  switch (message.event) {
    case UserEvent.CREATE_USER:
      console.log("Create user event received", message.data);
      break;
    case UserEvent.GET_PRODUCTS_RESPONSE:
      console.log("products response received", message.data);
      Object.entries(message.data.products).forEach(([key, value]) => {
        productsDetailsMap.set(key, value);
      });
      break;
    default:
      console.log("No event available for ", message.event);
  }
};
  