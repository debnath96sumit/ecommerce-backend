export enum OrderEvent {
  GET_PRODUCTS_REQUEST = "get_products_request",
  GET_PRODUCTS_RESPONSE = "get_products_response",
}
  
export type TOPIC_TYPE =
  | "OrderEvents"
  | "ProductEvents";

export interface MessageType {
  headers?: Record<string, any>;
  event: OrderEvent;
  data: Record<string, any>;
}
  