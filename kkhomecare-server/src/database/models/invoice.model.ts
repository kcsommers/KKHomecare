import mongoose from 'mongoose';
import { Invoice } from '@kk/core';

const invoiceSchema = new mongoose.Schema({
  client: {
    name: String,
    email: String,
    phone: Number
  },
  items: [
    {
      name: String,
      total: Number,
      itemId: Number,
      description: String
    }
  ],
  total: Number,
  paid: Boolean,
  dueDate: Number,
  dateSent: Number,
  datePaid: Number
});

export const InvoiceModel = mongoose.model<Invoice>('Invoice', invoiceSchema);