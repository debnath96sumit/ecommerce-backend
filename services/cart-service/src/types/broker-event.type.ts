export enum CartEvent {
    CREATE_USER = "create_user",
    GET_CARTS_REQUEST = "get_carts_request",
    GET_CARTS_RESPONSE = "get_carts_response",
}
  
  export type TOPIC_TYPE =
    | "CartEvents";
  
  export interface MessageType {
    headers?: Record<string, any>;
    event: CartEvent;
    data: Record<string, any>;
  }
  