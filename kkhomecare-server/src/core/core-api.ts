export { Admin } from './model/admin';
export { Image, BeforeAfter } from './model/images';
export { Invoice, InvoiceItem } from './model/invoices';
export { Client } from './model/clients';
export { Message } from './model/messages';
export interface ApiResponse {
  success: boolean;
  error: Error;
}