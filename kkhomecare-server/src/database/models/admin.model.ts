import mongoose from 'mongoose';
import { Admin } from '@kk/core';

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String
});

export const AdminModel = mongoose.model<Admin>('Admin', adminSchema);