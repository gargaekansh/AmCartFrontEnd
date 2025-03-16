import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../../services/home.service';
import { ProductView2 } from '../../../models/product2.model'; // Adjust the path as necessary
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../truncate.pipe';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TruncatePipe, CommonModule, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  homePageData: ProductView2[] = [];
  isLoadingDone: boolean = false;

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.getHomeContent();
  }

  getHomeContent() {
    this.homeService.getHomePage().subscribe((data: ProductView2[]) => {
      //console.log('API Response:', data); // Log the entire API response for debugging
      if (data && Array.isArray(data)) {
        this.homePageData = data; // Directly assign the array of products
        console.log('HomePage data:', data.length); // Print data to console for debugging
      } else {
        console.error('Products data is missing or not an array in the API response');
      }
      this.isLoadingDone = true;
    }, (error) => {
      console.error('Error fetching home page data:', error);
      this.isLoadingDone = true;
    });
  }

  getUniqueCategories(products: ProductView2[]): string[] {
    return [...new Set(products.map(product => product.category))];
  }

  getProductsByCategory(category: string): ProductView2[] {
    return this.homePageData.filter(product => product.category === category);
  }

  goToDetail(id: string) {
    if (!id) {
        console.error('Product ID is null or undefined');
        return;
    }
    alert('Navigating to product detail page for product ID: ' + id);  
    console.log('Navigating to product detail page for product ID:', id);
    this.router.navigate(['/product/item', id]);
}
}