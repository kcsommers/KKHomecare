import mongoose from 'mongoose';
import { Invoice } from '@kk/core';

const invoiceSchema = new mongoose.Schema({
  client: {
    name: String,
    email: String,
    phone: Number
  },
  total: String,
  items: [
    {
      name: String,
      totalNum: Number,
      totalString: String,
      itemId: Number,
      description: String
    }
  ],
  paid: Boolean,
  dueDate: Date,
  dateSent: Date,
  datePaid: Date
});

export const InvoiceModel = mongoose.model<Invoice>('Invoice', invoiceSchema);