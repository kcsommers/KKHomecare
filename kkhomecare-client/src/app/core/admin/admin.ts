export interface MessageModel {
  client: {
    username: string;
    email: string;
    phone: string;
  };
  message: string;
  seen: boolean;
  date: string;
  _id: string;
}

export interface MessagesResponse {
  success: boolean;
  error: Error;
  messages: MessageModel[];
  totalNew: number;
}
