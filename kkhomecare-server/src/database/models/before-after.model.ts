import mongoose from 'mongoose';
import { BeforeAfter } from '@kk/core';

const beforeAfterSchema = new mongoose.Schema({
  beforeUrl: String,
  afterUrl: String
});

export const BeforeAfterModel = mongoose.model<BeforeAfter>('BeforeAfter', beforeAfterSchema);