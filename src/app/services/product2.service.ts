import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ProductFilterView2, ProductView2 } from '../models/product2.model';
import { environment } from '../../environments/environment';
// import { OrderRequest } from '../models/orderRequest.model';
// import { CartItem } from '../models/cart.model';
// import { WishListBase, WishListQuery } from '../models/wishlist.model';
@Injectable({
  providedIn: 'root',
})
export class ProductService2 {
  private apiUrl = environment.productApiUrl;
  constructor(private http: HttpClient) {}

  getCategories(slug: string): Observable<ProductView2[]> {
    return this.http.get<ProductView2[]>(`${this.apiUrl}/category/${slug}`).pipe(
      catchError((error) => {
        console.error('Error :', error);
        return throwError(() => error);
      })
    );
  }
  getProducts(url: string): Observable<ProductFilterView2[]> {
    return this.http.get<ProductFilterView2[]>(`${this.apiUrl}${url}`).pipe(
      catchError((error) => {
        console.error('Error :', error);
        return throwError(() => error);
      })
    );
  }
}
