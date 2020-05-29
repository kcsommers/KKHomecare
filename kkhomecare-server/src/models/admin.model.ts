import mongoose from 'mongoose';

export interface Admin {
  username: string,
  password: string,
  email: string
}

const adminSchema = new mongoose.Schema<Admin>({
  username: String,
  password: String,
  email: String
});

export const Admin = mongoose.model('Admin', adminSchema);