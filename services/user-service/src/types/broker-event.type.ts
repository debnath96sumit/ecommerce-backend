export enum UserEvent {
    CREATE_USER = "create_user",
    GET_PRODUCTS_REQUEST = "get_products_request",
    GET_PRODUCTS_RESPONSE = "get_products_response",
}
  
  export type TOPIC_TYPE =
    | "UserEvents"
    | "ProductEvents";
  
  export interface MessageType {
    headers?: Record<string, any>;
    event: UserEvent;
    data: Record<string, any>;
  }
  