import { Document } from "mongoose";

export interface Client extends Document {
  name: string,
  email: string;
  phone: string;
}