import { Component, OnInit } from '@angular/core';
import { OrderDetailQuery } from '../../../models/orderRequest.model';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../../common/loader/loader.component';
import { CartItem } from '../../../models/cart.model';

@Component({
  selector: 'app-detail-order',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './detail-order.component.html',
  styleUrl: './detail-order.component.css',
})
export class DetailOrderComponent implements OnInit {
  orderDetail!: OrderDetailQuery;
  showLoading: boolean = true;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.showLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getOrderDetail(id);
      this.showLoading = false;
    }
  }

  getOrderDetail(id: string) {
    this.orderService.getOrderById(id).subscribe((data) => {
      this.orderDetail = data;
      console.log(this.orderDetail);
    });
  }
  goToProductDetail(id: string) {
    this.router.navigate(['/product/item', id]);
  }
  getRoundedPrice(item: CartItem): number {
    return Math.floor(item.discountedPrice || item.price);
  }
}
