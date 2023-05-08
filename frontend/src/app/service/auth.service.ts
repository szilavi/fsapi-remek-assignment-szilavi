import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface AuthUser {
  name: string;
  _id: string;
  email: string;
  role: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http: HttpClient = inject(HttpClient);
  apiUrl: string = environment.apiUrl;

  private _userObject = new BehaviorSubject<AuthUser | null>(null);

  constructor() {}

  login(
    userLogin: any
  ): Observable<{ accessToken: string; refreshToken: string; user: AuthUser }> {
    return this.http
      .post<{ accessToken: string; refreshToken: string; user: AuthUser }>(
        `${this.apiUrl}login`,
        userLogin
      )
      .pipe(
        tap((data) => {
          if (data.accessToken && data.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
          }

          this._userObject.next(data.user);
        })
      );
  }

  refresh(): Observable<{ accessToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}refresh`, {
        refreshToken,
      })
      .pipe(
        tap((tokenData) => {
          if (tokenData && tokenData.accessToken) {
            localStorage.setItem('accessToken', tokenData.accessToken);
          }
        })
      );
  }

  logout() {
    const refreshToken = localStorage.getItem('refreshToken');

    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');

    return this.http.post(`${this.apiUrl}logout`, { refreshToken }).pipe(
      tap(() => {
        this._userObject.next(null);
      })
    );
  }

  get userObject(): BehaviorSubject<AuthUser | null> {
    return this._userObject;
  }

  me(): Observable<{ user: AuthUser }> {
    return this.http.get<{ user: AuthUser }>(`${this.apiUrl}me`).pipe(
      tap((user) => {
        this.userObject.next(user.user);
      })
    );
  }
}
