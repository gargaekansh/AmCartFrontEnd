import { Component } from '@angular/core';
import { User } from '../../../models/user.model';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../services/checkout.service';
import { CartItem } from '../../../models/cart.model';
import { CartService } from '../../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderRequest } from '../../../models/orderRequest.model';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { LoaderComponent } from '../../common/loader/loader.component';
@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {
  user: User;
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  shipping: number = 10;
  showLoading: boolean = true;
  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private orderService: OrderService
  ) {
    this.user = this.checkoutService.getUserData();
    if (this.user != null) {
      this.getCartItems();
    } else {
      this.router.navigate(['cart']);
    }
    this.showLoading = false;
  }

  getCartItems() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
      this.calculateTotalPrice();
    });
  }
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) =>
        sum +
        (item.discountedPrice !== 0
          ? item.discountedPrice * item.orderCount
          : item.price * item.orderCount),
      0
    );
  }
  placeOrder() {
    // make api call to product service
    this.showLoading = true;
    const orderRequest: OrderRequest = {
      cartItems: this.cartItems,
      user: this.user,
      paymentMode: 'COD',
      totalCost: this.totalPrice + this.shipping,
    };
    console.log('Order request', orderRequest);

    this.orderService.placeOrder(orderRequest).subscribe((data) => {
      this.router.navigate(['/order/confirmation']);
    });
  }
}
