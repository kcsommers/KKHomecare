import mongoose from 'mongoose';
import { Image } from '@kk/core';

const imageSchema = new mongoose.Schema({
  url: String,
  tag: String
});

export const ImageModel = mongoose.model<Image>('Image', imageSchema);