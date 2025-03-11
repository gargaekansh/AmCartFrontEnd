import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderService } from '../../../services/header.service';
import { CategoryView } from '../../../models/category.model';
import { Router } from '@angular/router';
import { PopupCartComponent } from '../../cart/popup-cart/popup-cart.component';
import { CartService } from '../../../services/cart.service';
import { LoginComponent } from '../../user/login/login.component';
import { AuthService } from '../../../services/auth.service';
import { SuggestionComponent } from '../../search/suggestion/suggestion.component';
import { RegisterUserComponent } from '../../user/register-user/register-user.component';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [
    CommonModule,
    PopupCartComponent,
    SuggestionComponent,
    RouterModule,
  ],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css',
})
export class MainHeaderComponent implements OnInit {
  userName: string = '';
  categoriesByGender: { [gender: string]: CategoryView[] } = {};
  cartCount: number = 0; // Initialize cart count
  isLoggedIn: boolean = false;
  showRegisterComponent: boolean = false;
  showLoginComponent: boolean = false;
  constructor(
    private headerService: HeaderService,
    private router: Router,
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.headerService.getCategories().subscribe((data) => {
      this.categoriesByGender = data.reduce((acc, category) => {
        if (!acc[category.gender]) {
          acc[category.gender] = [];
        }
        acc[category.gender].push(category);
        return acc;
      }, {} as { [gender: string]: CategoryView[] }); // Type assertion here
    });
  }
  ngOnInit(): void {
    // Subscribe to cart count updates
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
      console.log('Cart count in header:', this.cartCount); // Log the cart count
    });

    // Subscribe to the userInfo$ observable to get updates
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.userName = userInfo.name; // Set username from decoded token
        this.isLoggedIn = true;
      } else {
        this.userName = '';
        this.isLoggedIn = false;
      }
    });

    if (this.authService.isAuthenticated()) {
      const token = localStorage.getItem('authToken')?.toString();
      const decodedToken = this.authService.decodeToken(token!);
      this.userName = decodedToken.name;
      this.isLoggedIn = true;
    }
  }

  // Add a getter to return the keys of categoriesByGender
  get genderKeys(): string[] {
    return Object.keys(this.categoriesByGender);
  }

  showProducts(slug: string) {
    this.router.navigate(['/product/category', slug]);
  }
  goToCart() {
    this.router.navigate(['cart']);
  }
  goToLogin() {
    this.router.navigate(['user/login']);
  }
  logout() {
    this.authService.logout();
  }
  goToOrderList() {
    this.router.navigate(['order/list']);
  }
  goToWishList() {
    this.router.navigate(['user/wishlist']);
  }
}
