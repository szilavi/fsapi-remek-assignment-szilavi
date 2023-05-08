import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/model/address';
import { User } from 'src/app/model/user';
import { UserService } from 'src/app/service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  // FORGOT PASS

  forgotMessage: string = '';

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  // SIGN IN

  loginMessage: string = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  // SIGN UP

  info: string = '';

  registrationForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z].*[A-Z])(?=.*\d.*\d).*$/),
      ]),
      repeatPassword: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zip: new FormControl('', Validators.required),
      agreeTerms: new FormControl(false, Validators.requiredTrue),
    },
    { validators: this.passwordMatchValidator }
  );

  registrationSuccess: boolean = false;

  signIn(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        () => {
          this.loginMessage = 'Successful login!';
          this.router.navigate(['/store']);
        },
        (error) => {
          this.loginMessage = error.error.message;
          this.loginForm.patchValue({ password: '' });
          this.loginForm.get('password')!.markAsUntouched();
          this.loginForm.get('password')!.markAsPristine();
        }
      );
    }
  }

  register(): void {
    if (this.registrationForm.valid) {
      const newUser: User = new User();
      newUser.name = this.registrationForm.value.name!;
      newUser.role = 1;
      newUser.phone = this.registrationForm.value.phone!;
      newUser.email = this.registrationForm.value.email!;
      newUser.password = this.registrationForm.value.password!;
      newUser.address.street = this.registrationForm.value.street!;
      newUser.address.city = this.registrationForm.value.city!;
      newUser.address.country = this.registrationForm.value.country!;
      newUser.address.zip = Number(this.registrationForm.value.zip);
      this.userService.create(newUser).subscribe(
        (response: { message: string }) => {
          this.registrationSuccess = true;
          this.info = response.message;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400 && error.error.message) {
            if (typeof error.error.message === 'object') {
              const errorMessages = error.error.message;
              this.info = Object.entries(errorMessages)
                .map(([key, value]) => value)
                .join(', ');
            } else {
              this.info = error.error.message;
            }
            this.registrationForm.patchValue({ email: '' });
            this.registrationForm.patchValue({ password: '' });
            this.registrationForm.patchValue({ repeatPassword: '' });
          }
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const passwordControl = control.get('password');
    const repeatPasswordControl = control.get('repeatPassword');

    if (
      passwordControl &&
      repeatPasswordControl &&
      passwordControl.value !== repeatPasswordControl.value
    ) {
      repeatPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      if (repeatPasswordControl?.errors?.['passwordMismatch']) {
        delete repeatPasswordControl.errors['passwordMismatch'];
        if (!Object.keys(repeatPasswordControl.errors).length) {
          repeatPasswordControl.setErrors(null);
        }
      }
    }

    return null;
  }

  forgotPassword(): void {
    if (this.forgotForm.valid) {
      this.userService.forgotPassword(this.forgotForm.value.email!).subscribe(
        (response) => {
          this.forgotMessage = response.message;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 400 && error.error.message) {
            this.forgotMessage = error.error.message;
          }
        }
      );
    }
  }
}
