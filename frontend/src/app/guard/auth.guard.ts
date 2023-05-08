import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, catchError, map, of, switchMap, take } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.authService.userObject.value !== null) {
      return true;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.refresh().pipe(
      take(1),
      switchMap((tokenData) => {
        if (tokenData && tokenData.accessToken) {
          localStorage.setItem('accessToken', tokenData.accessToken);
          return this.authService.me().pipe(
            take(1),
            map((user) => {
              if (user) {
                return true;
              } else {
                this.router.navigate(['/login']);
                return false;
              }
            }),
            catchError(() => {
              this.router.navigate(['/login']);
              return of(false);
            })
          );
        } else {
          this.router.navigate(['/login']);
          return of(false);
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
