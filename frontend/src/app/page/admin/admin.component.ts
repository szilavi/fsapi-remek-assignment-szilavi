import { Component, inject } from '@angular/core';
import { ConfigService } from 'src/app/service/config.service';
import { ProductService } from 'src/app/service/product.service';
import { WishlistService } from 'src/app/service/wishlist.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  config: ConfigService = inject(ConfigService);
  productService: ProductService = inject(ProductService);
  wishListService: WishlistService = inject(WishlistService);
}
