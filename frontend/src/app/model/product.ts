export class Product {
  gameId: string = '';
  sellerId: string = '';
  status: string = '';
  condition?: string = '';
  price?: number = 0;
  [propName: string]: any;
}
