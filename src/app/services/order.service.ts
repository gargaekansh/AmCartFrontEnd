// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, catchError, map, throwError } from 'rxjs';
// import { environment } from '../../environments/environment';
// import {
//   OrderConfirmed,
//   OrderDetailQuery,
//   OrderQuery,
//   OrderRequest,
// } from '../models/orderRequest.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class OrderService {
//   private orderData: OrderConfirmed = {
//     cartItems: [],
//     invoiceId: '',
//     paymentMode: '',
//     totalCost: 0,
//     user: {
//       addressDetail: { city: '', country: '', streetAddress: '', zipCode: 0 },
//       personalInformation: { email: '', name: '', phone: 0 },
//     },
//     orderStatus: 'Pending',
//   };

//   apiUrl = environment.productApiUrl;
//   constructor(private http: HttpClient) {}

//   placeOrder(order: OrderRequest): Observable<any> {
//     this.orderData.cartItems = order.cartItems;
//     (this.orderData.paymentMode = order.paymentMode),
//       (this.orderData.user = order.user),
//       (this.orderData.totalCost = order.totalCost);

//     return this.http.post(`${this.apiUrl}/order`, order).pipe(
//       // get the invoice id from api request
//       map((response: any) => {
//         this.orderData.invoiceId = response.invoiceId;
//         this.orderData.orderStatus = response.orderStatus;
//         return response;
//       }),
//       catchError((error) => {
//         console.error('Error :', error);
//         return throwError(() => error);
//       })
//     );
//   }
//   getOrderDetail(): OrderConfirmed {
//     return this.orderData;
//   }
//   getOrderList(): Observable<OrderQuery[]> {
//     return this.http.get<OrderQuery[]>(`${this.apiUrl}/order/get`).pipe(
//       catchError((error) => {
//         console.error('Error :', error);
//         return throwError(() => error);
//       })
//     );
//   }
//   getOrderById(id: string): Observable<OrderDetailQuery> {
//     return this.http
//       .get<OrderDetailQuery>(`${this.apiUrl}/order/get/${id}`)
//       .pipe(
//         catchError((error) => {
//           console.error('Error :', error);
//           return throwError(() => error);
//         })
//       );
//   }
// }
