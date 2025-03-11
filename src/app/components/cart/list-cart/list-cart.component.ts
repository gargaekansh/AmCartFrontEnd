import { Component } from '@angular/core';
import { CartItem } from '../../../models/cart.model';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-cart.component.html',
  styleUrl: './list-cart.component.css',
})
export class ListCartComponent {
  cartItems: CartItem[] = [];
  cartCount: number = 0;
  totalPrice: number = 0;
  shipping: number = 10; // Example shipping cost

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.cartCount = items.length;
      this.calculateTotal();
    });
  }

  removeItem(item: CartItem): void {
    this.cartService.removeItem(item);
    this.calculateTotal();
  }

  increaseQuantity(item: CartItem): void {
    this.cartService.updateCartItem(item, true);
    this.calculateTotal();
  }

  decreaseQuantity(item: CartItem): void {
    this.cartService.updateCartItem(item, false);
    this.calculateTotal();
  }

  calculateTotal(): void {
    console.log(this.cartItems);
    this.totalPrice = this.cartItems.reduce((acc, item) => {
      return (
        acc +
        (item.discountedPrice !== 0 ? item.discountedPrice : item.price) *
          item.orderCount
      );
    }, 0);
    console.log(this.totalPrice);
  }

  placeOrder(): void {
    console.log('Placing order with the following items:', this.cartItems);
    this.router.navigate(['/order/billing']);
  }
}
