import { Document } from 'mongoose';

export interface Image extends Document {
  url: string;
  tag: string;
}

export interface BeforeAfter extends Document {
  beforeUrl: string;
  afterUrl: string;
}

