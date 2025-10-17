import {
    MessageType,
    CartEvent,
  } from "../types";
  
  export const HandleProductEvent = async (message: MessageType) => {
    console.log(`UserEvent received`, message);
    switch (message.event) {
      case CartEvent.GET_CARTS_REQUEST:
        console.log("Fetch product event received", message.data);
        break;
      default:
        console.log("No event available for ", message.event);
    }
  };
  