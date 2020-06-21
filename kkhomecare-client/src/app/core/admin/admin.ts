export interface ClientModel {
  username: string;
  email: string;
  phone: string;
  _id?: string;
}

export interface InvoiceItem {
  name: string,
  total: number,
  itemId: number,
  description: string
}

export interface InvoiceModel {
  client: ClientModel;
  items: InvoiceItem[];
  total: number;
  paid: boolean;
  dueDate: number;
  dateSent: number;
  datePaid: number;
  _id?: string;
}

export interface InvoicesResponse {
  error: Error;
  invoices: InvoiceModel[];
}
