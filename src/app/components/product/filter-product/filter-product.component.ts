import { Component } from '@angular/core';
import {
  ProductFilterView,
  ProductItemFilterFlatten,
} from '../../../models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { SearchResponse } from '../../../models/searchResponse.model';
import { SearchService } from '../../../services/search.service';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../truncate.pipe';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-filter-product',
  standalone: true,
  imports: [CommonModule, TruncatePipe, LoaderComponent],
  templateUrl: './filter-product.component.html',
  styleUrl: './filter-product.component.css',
})
export class FilterProductComponent {
  products: ProductItemFilterFlatten[] = [];
  showLoading: boolean = true;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.searchQuery$.subscribe((query) => {
      if (query) {
        this.productService.getProducts(query).subscribe((data) => {
          this.products = this.flattenProducts(data);
          this.showLoading = false;
        });
      }
    });
  }

  // Calculate discount percentage
  calculateDiscount(price: {
    originalPrice: number;
    discountPrice: number;
  }): number {
    if (price.discountPrice > 0) {
      return Math.round(
        ((price.originalPrice - price.discountPrice) / price.originalPrice) *
          100
      );
    }
    return 0;
  }
  goToDetail(id: string) {
    this.router.navigate(['/product/item', id]);
  }
  flattenProducts(products: ProductFilterView[]): ProductItemFilterFlatten[] {
    return products.flatMap((product) =>
      product.productItems.map((item) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        brand: product.brand,
        productItemId: item.id,
        price: item.price,
        images: item.images,
      }))
    );
  }
}
