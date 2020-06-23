import { Document } from 'mongoose';
import { Client } from './clients';

export interface InvoiceItem {
  name: string,
  total: number,
  itemId: number,
  description: string
}

export interface Invoice extends Document {
  client: Client,
  items: InvoiceItem[];
  total: number;
  paid: boolean;
  dueDate: number;
  dateSent: number;
  datePaid: number;
}

export interface InvoiceQuery {
  _id?: { $gt: string };
  paid?: boolean;
  dueDate?: { $lt: number };
  'client.name'?: RegExp;
}
