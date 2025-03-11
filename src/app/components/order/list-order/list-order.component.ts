import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { OrderQuery } from '../../../models/orderRequest.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-order',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-order.component.html',
  styleUrl: './list-order.component.css',
})
export class ListOrderComponent implements OnInit {
  orderList: OrderQuery[] = [];
  constructor(private orderService: OrderService, private router: Router) {}
  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList() {
    this.orderService.getOrderList().subscribe((data) => {
      this.orderList = data;
    });
  }
  viewOrder(id: string) {
    this.router.navigate(['order/detail', id]);
  }
}
