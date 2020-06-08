import { JobTypes } from '../kk-services/kk-services';

export interface FormSubmission {
  name: string;
  email: string;
  phone: number;
  message: string;
  jobType: JobTypes;
}
