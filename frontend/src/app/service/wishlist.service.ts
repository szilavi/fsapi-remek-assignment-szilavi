import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wishlist } from '../model/wishlist';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService extends BaseService<Wishlist> {
  override entityName: string = 'wishlist';

  constructor() {
    super();
  }

  getWishByUserId(userId: string): Observable<any> {
    return this.http.get(this.getUrl(`/${userId}`));
  }
}
