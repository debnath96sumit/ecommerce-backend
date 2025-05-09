export enum UserEvent {
    CREATE_USER = "create_user",
}
  
  export type TOPIC_TYPE =
    | "UserEvents";
  
  export interface MessageType {
    headers?: Record<string, any>;
    event: UserEvent;
    data: Record<string, any>;
  }
  