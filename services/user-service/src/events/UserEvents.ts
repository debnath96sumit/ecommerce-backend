import {
    MessageType,
    UserEvent,
  } from "../types";
  
  export const HandleUserEvent = async (message: MessageType) => {
    console.log(`UserEvent received`, message);
    switch (message.event) {
      case UserEvent.CREATE_USER:
        console.log("Create user event received", message.data);
        break;
      default:
        console.log("No event available for ", message.event);
    }
  };
  