import { Component, OnInit } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../models/cart.model';

@Component({
  selector: 'app-popup-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup-cart.component.html',
  styleUrl: './popup-cart.component.css',
})
export class PopupCartComponent implements OnInit {
  showPopup: boolean = false;
  popupData: CartItem | null = null;
  cartCount: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    // Subscribe to cart count updates
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
      console.log('pop up', this.cartCount);
    });

    // Subscribe to popup visibility updates
    this.cartService.showPopup$.subscribe((show) => {
      this.showPopup = show;
    });

    // Subscribe to popup data updates
    this.cartService.popupData$.subscribe((data) => {
      this.popupData = data;
      console.log(this.popupData);
    });
  }
}
