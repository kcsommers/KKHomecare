import mongoose from 'mongoose';
import { Client } from '@kk/core';

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String
});

export const ClientModel = mongoose.model<Client>('Client', clientSchema);