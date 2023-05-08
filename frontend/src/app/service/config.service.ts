import { Injectable } from '@angular/core';

export interface ITableCol {
  key: string;
  text: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  commonCols = {
    id: { key: '_id', text: '#', visible: false },
    gameId: { key: 'gameId', text: 'Game', visible: true },
    price: { key: 'price', text: 'Price', visible: true },
  };

  productCols: ITableCol[] = [
    this.commonCols.id,
    this.commonCols.gameId,
    { key: 'sellerId', text: 'Shop', visible: true },
    this.commonCols.price,
  ];

  offerCols: ITableCol[] = [
    this.commonCols.id,
    this.commonCols.gameId,
    { key: 'sellerId', text: 'User', visible: true },
    this.commonCols.price,
  ];

  wishCols: ITableCol[] = [
    this.commonCols.id,
    this.commonCols.gameId,
    { key: 'userId', text: 'User', visible: true },
  ];

  userCols: ITableCol[] = [
    { key: 'role', text: 'Role', visible: false },
    { key: 'name', text: 'Name', visible: true },
    { key: 'email', text: 'Email', visible: true },
    { key: 'phone', text: 'Phone', visible: true },
    { key: 'address', text: 'Address', visible: false },
  ];

  offersCols: ITableCol[] = [
    this.commonCols.id,
    { key: 'gameTitle', text: 'Game', visible: true },
    this.commonCols.price,
    { key: 'status', text: 'Status', visible: true },
  ];

  wishesCols: ITableCol[] = [
    this.commonCols.id,
    { key: 'gameTitle', text: 'Game', visible: true },
  ];

  constructor() {}

  setVisibility(colKey: string, visible: boolean, cols: ITableCol[]): void {
    const col = cols.find((c) => c.key === colKey);
    if (col) {
      col.visible = visible;
    }
  }
}
