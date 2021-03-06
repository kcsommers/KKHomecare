export { Admin } from './model/admin';
export { Image, BeforeAfter } from './model/images';
export { Invoice, InvoiceItem, InvoiceQuery } from './model/invoices';
export { Client } from './model/clients';
export interface ApiResponse {
  success: boolean;
  error: Error;
};