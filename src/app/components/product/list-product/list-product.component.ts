import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { ProductView } from '../../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../../../truncate.pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-product',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './list-product.component.html',
  styleUrl: './list-product.component.css',
})
export class ListProductComponent implements OnInit {
  products: ProductView[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameter changes
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || '';
      console.log(slug); // Log the new slug
      this.GetProducts(slug); // Fetch products based on the new slug
    });
  }

  GetProducts(slug: string) {
    this.productService.getCategories(slug).subscribe((data) => {
      this.products = data;
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
}
