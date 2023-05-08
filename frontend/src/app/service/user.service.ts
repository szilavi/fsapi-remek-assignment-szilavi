import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<User> {
  override entityName: string = 'user';

  constructor() {
    super();
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}${this.entityName}/forgot-password`,
      { email }
    );
  }
}
