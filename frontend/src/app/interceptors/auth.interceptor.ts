import { Injectable, inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, take, filter } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  authService: AuthService = inject(AuthService);

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const accessToken = localStorage.getItem('accessToken');

    if (accessToken) {
      req = this.addToken(req, accessToken);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          return this.handle403Error(req, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  private handle403Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refresh().pipe(
        switchMap((tokenData: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokenData.accessToken);
          return next.handle(this.addToken(request, tokenData.accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token: any) => token != null),
        take(1),
        switchMap((jwt: any) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}

// import { Injectable, inject } from '@angular/core';
// import {
//   HttpInterceptor,
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
// } from '@angular/common/http';
// import { Observable, catchError, switchMap, throwError } from 'rxjs';
// import { AuthService } from '../service/auth.service';

// @Injectable()
// export class AuthInterceptor implements HttpInterceptor {
//   authService: AuthService = inject(AuthService);

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     const accessToken = localStorage.getItem('accessToken');
//     let request = req;

//     if (accessToken) {
//       const authReq = req.clone({
//         headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
//       });

//       return next.handle(authReq).pipe(
//         catchError((err) => {
//           if (err.status === 401) {
//             return throwError(() => new Error('You have to login!'));
//           } else if (err.status === 403) {
//             return this.handle403Error(authReq, next);
//           } else {
//             return throwError(() => new Error('Oups, something happend.'));
//           }
//         })
//       );
//     }

//     return next.handle(req);
//   }

//   handle403Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
//     return this.authService.refresh().pipe(
//       switchMap((tokenData) => {
//         const newRequest = req.clone({
//           headers: req.headers.set(
//             'Authorization',
//             `Bearer ${tokenData.accessToken}`
//           ),
//         });

//         return next.handle(newRequest);
//       })
//     );
//   }
// }
