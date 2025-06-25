export enum ProductEvent {
    CREATE_USER = "create_user",
}
  
  export type TOPIC_TYPE =
    | "ProductEvents";
  
  export interface MessageType {
    headers?: Record<string, any>;
    event: ProductEvent;
    data: Record<string, any>;
  }
  