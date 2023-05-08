import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
})
export class EditUserComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  userService: UserService = inject(UserService);
  formBuilder: FormBuilder = inject(FormBuilder);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  user$: Observable<User> = this.activatedRoute.params.pipe(
    switchMap((params) => this.userService.get(params['id']))
  );

  role = this.authService.userObject.value?.role;
  IamAnAdmin = false;

  user: User = new User();

  info: string = '';

  userForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z].*[A-Z])(?=.*\d.*\d).*$/),
      ]),
      repeatNewPassword: new FormControl('', Validators.minLength(8)),
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zip: new FormControl(0, Validators.required),
    },
    { validators: this.passwordMatchValidator }
  );

  updateSuccess: boolean = false;

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      this.user = user;
      this.userForm.patchValue({
        email: user.email,
        name: user.name,
        phone: user.phone,
        street: user.address.street,
        city: user.address.city,
        country: user.address.country,
        zip: user.address.zip,
      });

      // Összehasonlítjuk a két értéket
      if (user['_id'] === this.authService.userObject.value?._id) {
        this.IamAnAdmin = true;
      }
    });
  }

  updateUserData(): void {
    if (this.userForm.valid) {
      this.user.name = this.userForm.value.name!;
      this.user.role = 1;
      this.user.phone = this.userForm.value.phone!;
      this.user.email = this.userForm.value.email!;
      this.user.password = this.userForm.value.password!;
      this.user.address.street = this.userForm.value.street!;
      this.user.address.city = this.userForm.value.city!;
      this.user.address.country = this.userForm.value.country!;
      this.user.address.zip = Number(this.userForm.value.zip);
      if (this.userForm.value.newPassword) {
        this.user.newPassword = this.userForm.value.newPassword!;
      }
      this.userService.update(this.user).subscribe(
        (response: { message: string }) => {
          this.updateSuccess = true;
          this.info = 'Changes saved';
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
            this.userForm.patchValue({ newPassword: '' });
            this.userForm.patchValue({ repeatNewPassword: '' });
          }
        }
      );
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const newPasswordControl = control.get('newPassword');
    const repeatNewPasswordControl = control.get('repeatNewPassword');

    if (
      newPasswordControl &&
      repeatNewPasswordControl &&
      newPasswordControl.value !== repeatNewPasswordControl.value
    ) {
      repeatNewPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      if (repeatNewPasswordControl?.errors?.['passwordMismatch']) {
        delete repeatNewPasswordControl.errors['passwordMismatch'];
        if (!Object.keys(repeatNewPasswordControl.errors).length) {
          repeatNewPasswordControl.setErrors(null);
        }
      }
    }

    return null;
  }

  onDeleteUser(): void {
    this.userService.adminRemove(this.user['_id']).subscribe((response) => {
      this.info = response['message']; // Ezt a sort kell hozzáadni
      console.log(response);
    });
  }
}
