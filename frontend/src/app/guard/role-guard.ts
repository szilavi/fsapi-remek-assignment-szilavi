import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.authService.userObject.pipe(
      map((user) => {
        if (user && user.role === 3) {
          return true;
        } else {
          this.router.navigate(['/home']);
          console.log(user?.role);
          return false;
        }
      })
    );
  }
}
