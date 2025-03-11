import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { OrderConfirmed } from '../../../models/orderRequest.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../common/loader/loader.component';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css',
})
export class ConfirmOrderComponent implements OnInit {
  showLoading: boolean = true;
  orderConfirmed!: OrderConfirmed;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getOrderConfirmationData();
    this.cartService.removeFromCart();
  }

  getOrderConfirmationData() {
    this.orderConfirmed = this.orderService.getOrderDetail();
    this.showLoading = false;
  }
  goToHome() {
    this.router.navigate(['/']);
  }
}
