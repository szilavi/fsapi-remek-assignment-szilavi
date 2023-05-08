import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, AuthUser } from 'src/app/service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  userSubscription$!: Subscription;

  user!: AuthUser | null;

  ngOnInit(): void {
    this.getMe();
    this.userSubscription$ = this.authService.userObject.subscribe((user) => {
      if (!user) {
        this.router.navigate(['/home']);
      }
      this.user = user;
    });
  }

  getMe() {
    if (localStorage.getItem('accessToken')) {
      this.authService.me().subscribe();
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.authService.userObject.next(null);
      },
      error: (error: HttpErrorResponse) => {
        this.authService.userObject.next(null);

        console.error('Something went wrong:', error);
      },
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription$) {
      this.userSubscription$.unsubscribe();
    }
  }
}
