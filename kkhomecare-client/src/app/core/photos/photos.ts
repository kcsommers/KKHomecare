import { MomentInput } from 'moment';

export enum Filters {
  CLEANING = 'cleaning',
  PAINTING = 'painting',
  LANDSCAPING = 'landscaping',
  COMMERCIAL = 'commercial',
  RESIDENTIAL = 'residential'
}

export interface ImageModel {
  _id: string,
  url: string;
  tag?: Filters;
}

export interface BeforeAfterModel {
  _id: string;
  beforeUrl: string;
  afterUrl: string;
}

export interface PhotosResponse {
  error: Error;
  images: ImageModel[] | BeforeAfterModel[];
}

export interface BeforeAfterResponse {
  error: Error;
  images: BeforeAfterModel[];
}

export interface CloudinaryUploadResult {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: MomentInput;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}
