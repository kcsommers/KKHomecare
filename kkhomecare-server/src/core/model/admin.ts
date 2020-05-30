import { Document } from 'mongoose';

export interface Admin extends Document {
  username: string,
  password: string,
  email: string
}
