import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-more-info',
  templateUrl: './more-info.component.html',
  styleUrls: ['./more-info.component.scss'],
})
export class MoreInfoComponent {
  productService: ProductService = inject(ProductService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router: Router = inject(Router);

  product$: Observable<Product> = this.activatedRoute.params.pipe(
    switchMap((params) => this.productService.get(params['id']))
  );

  buyNow(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.router.navigateByUrl(`/store/buy-now/${id}`);
  }
}
