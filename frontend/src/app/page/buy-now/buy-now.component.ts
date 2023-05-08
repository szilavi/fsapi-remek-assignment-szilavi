import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from 'src/app/model/product';
import { User } from 'src/app/model/user';
import { AuthService } from 'src/app/service/auth.service';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-buy-now',
  templateUrl: './buy-now.component.html',
  styleUrls: ['./buy-now.component.scss'],
})
export class BuyNowComponent {
  productService: ProductService = inject(ProductService);
  userService: UserService = inject(UserService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  wishlistService: WishlistService = inject(WishlistService);

  product$: Observable<Product> = this.activatedRoute.params.pipe(
    switchMap((params) => this.productService.get(params['id']))
  );

  user$: Observable<User> = this.userService.get(
    this.authService.userObject.value?._id!
  );

  //Dummy Card Data
  cardData: string = '****  ****  ****  **** 2268';

  purchasedProduct: Product = new Product();

  onSubmit(product: Product) {
    this.product$.subscribe((product: Product) => {
      product.status = 'deal';

      this.productService.update(product).subscribe(
        async (response) => {
          console.log(response);
          if (response) {
            alert('Deal!');
            await this.removePurchasedGameFromWishlist(
              product['_id'],
              this.authService.userObject.value?._id!
            );
            this.router.navigate(['/store']);
          } else {
            alert('Something went wrong');
          }
        },
        (error) => {
          console.error(error);
          alert('Something went wrong');
        }
      );
    });
  }

  async removePurchasedGameFromWishlist(
    productId: string,
    userId: string
  ): Promise<void> {
    try {
      const product = await this.productService.get(productId).toPromise();
      const gameId = product?.gameId;

      const wishlistItems = await this.wishlistService
        .getWishByUserId(userId)
        .toPromise();
      const foundWishItem = wishlistItems.find(
        (item: { gameId: string }) => item.gameId === gameId
      );

      console.log('Retrieved wishlist:', wishlistItems);
      console.log('Product ID to remove:', productId);

      if (foundWishItem) {
        await this.wishlistService.remove(foundWishItem._id).toPromise();
      }
    } catch (error) {
      console.error('Error removing purchased game from wishlist', error);
    }
  }
}
