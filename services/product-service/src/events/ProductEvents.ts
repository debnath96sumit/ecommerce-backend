import {
    MessageType,
    ProductEvent,
  } from "../types";
import { handleProductDetailsRequest } from "./Handlers/HandleProductEvents";
  
  export const HandleProductEvent = async (message: MessageType) => {
    console.log(`UserEvent received`, message);
    switch (message.event) {
      case ProductEvent.GET_PRODUCTS_REQUEST:
        console.log("Fetch product event received", message.data);
        handleProductDetailsRequest(message);
        break;
      default:
        console.log("No event available for ", message.event);
    }
  };
  