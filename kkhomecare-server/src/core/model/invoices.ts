import { Document } from 'mongoose';
import { Client } from './clients';

export interface InvoiceItem {
  name: string,
  totalNum: number,
  totalString: string,
  itemId: number,
  description: string
}

export interface Invoice extends Document {
  client: Client,
  items: InvoiceItem[];
  total: string;
  paid: boolean;
  dueDate: number;
  dateSent: number;
  datePaid: number;
}