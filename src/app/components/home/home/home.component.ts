import { Component, OnInit } from '@angular/core';
import { SuggestionComponent } from '../../search/suggestion/suggestion.component';
import { HomeService } from '../../../services/home.service';
import { HomePage } from '../../../models/home.model';
import { Router } from '@angular/router';
import { TruncatePipe } from '../../../truncate.pipe';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../common/loader/loader.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TruncatePipe, CommonModule, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  homePageData!: HomePage;
  isLoadingDone: boolean = false;

  constructor(private homeService: HomeService, private router: Router) {}

  ngOnInit(): void {
    this.getHomeContent();
  }

  getHomeContent() {
    this.homeService.getHomePage().subscribe((data) => {
      this.homePageData = data;
      this.isLoadingDone = true;
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
