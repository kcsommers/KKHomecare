import mongoose from 'mongoose';
import { Message } from '@kk/core';

const messageSchema = new mongoose.Schema({
  client: {
    name: String,
    email: String,
    phone: String
  },
  message: String,
  seen: Boolean,
  date: Date
});

export const MessageModel = mongoose.model<Message>('Message', messageSchema);