import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T extends { [x: string]: any }> {
  http: HttpClient = inject(HttpClient);
  apiUrl: string = environment.apiUrl;
  entityName: string = '';

  constructor() {}

  protected getUrl(endpoint: string, admin: boolean = false): string {
    const adminSegment = admin ? '/admin' : '';
    return `${this.apiUrl}${this.entityName}${adminSegment}${endpoint}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.getUrl('/'));
  }

  adminGetAll(): Observable<T[]> {
    return this.http.get<T[]>(this.getUrl('/', true));
  }

  get(_id: string): Observable<T> {
    return this.http.get<T>(this.getUrl(`/${_id}`));
  }

  adminGet(_id: string): Observable<T> {
    return this.http.get<T>(this.getUrl(`/${_id}`, true));
  }

  create(item: T): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.getUrl('/'), item);
  }

  adminCreate(item: T): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(this.getUrl('/', true), item);
  }

  update(item: T): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      this.getUrl(`/${item['_id']}`),
      item
    );
  }

  adminUpdate(item: T): Observable<{ message: string }> {
    return this.http.patch<{ message: string }>(
      this.getUrl(`/${item['_id']}`, true),
      item
    );
  }

  remove(id: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(`/${id}`));
  }

  adminRemove(_id: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(`/${_id}`, true));
  }
}
