import { Component, OnInit, inject } from '@angular/core';
import { AuthService, AuthUser } from 'src/app/service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  authService: AuthService = inject(AuthService);

  user!: AuthUser | null;

  ngOnInit(): void {
    this.authService.userObject.subscribe((user) => {
      this.user = user;
    });
    this.getMe();
  }

  getMe() {
    if (localStorage.getItem('accessToken')) {
      this.authService.me().subscribe();
    }
  }
}
