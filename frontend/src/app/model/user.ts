import { Address } from './address';

export class User {
  role: number = 1;
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  newPassword?: string = '';
  [propName: string]: any;
  address: Address = new Address();
}
