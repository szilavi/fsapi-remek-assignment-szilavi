import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { BaseService } from './base.service';
import { Game } from '../model/game';

@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService<Product> {
  override entityName: string = 'store';

  constructor() {
    super();
  }

  findGameByTitle(title: string): Observable<Game[]> {
    const search = `/game/search?title=${title}`;
    return this.http.get<Game[]>(this.getUrl(search));
  }

  getProductsByUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}store/user/offers/${userId}`);
  }
}
