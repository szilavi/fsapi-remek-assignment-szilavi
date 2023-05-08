import { HttpErrorResponse } from '@angular/common/http';
import { Component, Injectable, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  filter,
} from 'rxjs/operators';
import { Game } from 'src/app/model/game';
import { Product } from 'src/app/model/product';
import { AuthService } from 'src/app/service/auth.service';
import { ConfigService, ITableCol } from 'src/app/service/config.service';
import { ProductService } from 'src/app/service/product.service';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-user-offer',
  templateUrl: './user-offer.component.html',
  styleUrls: ['./user-offer.component.scss'],
})
export class UserOfferComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  configService: ConfigService = inject(ConfigService);

  form!: FormGroup;
  searchResult$!: Observable<Game[]>;
  formBuilder: FormBuilder = inject(FormBuilder);
  productService: ProductService = inject(ProductService);

  // Paragraph

  userRole = this.authService.userObject.value?.role;

  // GET OFFERS

  offers$: Observable<Product[]> = this.productService.getProductsByUserId(
    this.authService.userObject.value?._id!
  );

  cols: ITableCol[] = this.configService.offersCols;

  // ADD OFFER

  info: string = '';

  offerForm = new FormGroup({
    condition: new FormControl(''),
    price: new FormControl(''),
  });

  // ADD A NEW GAME OFFER

  newGameOffer = new FormGroup({
    title: new FormControl('', Validators.required),
    condition: new FormControl(''),
    price: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      search: '',
    });

    this.searchResult$ =
      this.form.get('search')?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        filter((value) => !!value.trim()),
        switchMap((value) =>
          this.productService
            .findGameByTitle(value)
            .pipe(map((games) => games || []))
        )
      ) || new Observable<Game[]>();
  }

  submitOffer(game: Game): void {
    const newProduct: Product = new Product();
    newProduct.gameId = game._id;
    newProduct.sellerId = this.authService.userObject.value?._id!;
    newProduct.status = 'offer';
    newProduct.condition = this.offerForm.value.condition?.trim()
      ? this.offerForm.value.condition
      : undefined;

    newProduct.price =
      Number(this.offerForm.value.price) !== 0
        ? Number(this.offerForm.value.price)
        : undefined;

    this.productService.create(newProduct).subscribe(
      (response: { message: string }) => {
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
        }
      }
    );
  }

  submitNewOffer(): void {
    const newProduct: Product = new Product();
    newProduct.sellerId = this.authService.userObject.value?._id!;
    newProduct.status = 'offer';
    newProduct['title'] = this.newGameOffer.value.title;
    newProduct.condition = this.newGameOffer.value.condition
      ? this.newGameOffer.value.condition
      : undefined;

    newProduct.price =
      Number(this.newGameOffer.value.price) !== 0
        ? Number(this.newGameOffer.value.price)
        : undefined;

    this.productService.create(newProduct).subscribe(
      (response: { message: string }) => {
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
        }
      }
    );
  }

  deleteOffer(offerId: string): void {
    if (confirm('Are you sure you want to delete this offer?')) {
      this.productService.remove(offerId).subscribe(
        () => {
          this.offers$ = this.productService.getProductsByUserId(
            this.authService.userObject.value?._id!
          );
        },
        (error) => {
          console.error('Something went wrong', error);
        }
      );
    }
  }
}
