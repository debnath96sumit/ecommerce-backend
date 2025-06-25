import {
    MessageType,
    ProductEvent,
  } from "../types";
  
  export const HandleProductEvent = async (message: MessageType) => {
    console.log(`UserEvent received`, message);
    switch (message.event) {
      case ProductEvent.CREATE_USER:
        console.log("Create user event received", message.data);
        break;
      default:
        console.log("No event available for ", message.event);
    }
  };
  