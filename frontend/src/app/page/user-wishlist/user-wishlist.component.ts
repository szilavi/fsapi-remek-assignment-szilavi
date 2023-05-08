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
import { Wishlist } from 'src/app/model/wishlist';
import { AuthService } from 'src/app/service/auth.service';
import { ConfigService, ITableCol } from 'src/app/service/config.service';
import { ProductService } from 'src/app/service/product.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-user-wishlist',
  templateUrl: './user-wishlist.component.html',
  styleUrls: ['./user-wishlist.component.scss'],
})
export class UserWishlistComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  configService: ConfigService = inject(ConfigService);

  form!: FormGroup;
  searchResult$!: Observable<Game[]>;
  formBuilder: FormBuilder = inject(FormBuilder);
  productService: ProductService = inject(ProductService);
  wishlistService: WishlistService = inject(WishlistService);

  // GET WISHES

  wishlist$: Observable<Product[]> = this.wishlistService.getWishByUserId(
    this.authService.userObject.value?._id!
  );

  cols: ITableCol[] = this.configService.wishesCols;

  // ADD Wish

  info: string = '';

  // ADD A NEW GAME WISH

  newGameWish = new FormGroup({
    title: new FormControl('', Validators.required),
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

  submitWish(game: Game): void {
    const newWish: Wishlist = new Wishlist();
    newWish.gameId = game._id;
    newWish.userId = this.authService.userObject.value?._id!;

    this.wishlistService.create(newWish).subscribe(
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

  submitNewWish(): void {
    const offerWithNewGame: Wishlist = new Wishlist();
    offerWithNewGame.gameId = '';
    offerWithNewGame.userId = this.authService.userObject.value?._id!;
    offerWithNewGame['title'] = this.newGameWish.get('title')?.value;
    console.log(offerWithNewGame);

    this.wishlistService.create(offerWithNewGame).subscribe(
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

  deleteWish(offerId: string): void {
    if (confirm('Are you sure you want to delete this wish?')) {
      this.wishlistService.remove(offerId).subscribe(
        () => {
          this.wishlist$ = this.wishlistService.getWishByUserId(
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
