import { Document } from 'mongoose';

export interface Message extends Document {
  client: {
    name: String,
    email: String,
    phone: Number
  },
  message: String,
  seen: Boolean,
  date: Date
}
