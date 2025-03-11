import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { WishListService } from '../../../services/wishlist.service';
import { WishListQuery } from '../../../models/wishlist.model';
import { LoaderComponent } from '../../common/loader/loader.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-list-wishlist',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './list-wishlist.component.html',
  styleUrl: './list-wishlist.component.css',
})
export class ListWishlistComponent implements OnInit {
  wishlist: WishListQuery[] = [];
  showLoading: boolean = true;
  isAuthenticated = false;
  constructor(
    private wishlistService: WishListService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlist$.subscribe((wishlist) => {
      this.wishlist = wishlist;
    });
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;

      this.wishlistService.GetWishlists(); // Fetch wishlist initially
    }
    this.showLoading = false;
  }

  removeFromWishlist(id: string) {
    this.wishlistService.RemoveWishlist(id);
    this.showLoading = false;
  }
  goToDetail(id: string) {
    this.router.navigate(['/product/item', id]);
  }
}
