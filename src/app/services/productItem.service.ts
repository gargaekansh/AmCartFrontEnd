import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  ProductItemCommand,
  ProductItemView,
} from '../models/productItem.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductItemService {
  private apiUrl = environment.productItemApiUrl;

  constructor(private http: HttpClient) {}

  addProductItem(productItem: ProductItemCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, productItem).pipe(
      catchError((error) => {
        console.error('Error :', error);
        return throwError(() => error);
      })
    );
  }
  getProductItems(): Observable<ProductItemView[]> {
    return this.http.get<ProductItemView[]>(`${this.apiUrl}/get-all`).pipe(
      catchError((error) => {
        console.error('Error :', error);
        return throwError(() => error);
      })
    );
  }
  getProductItemById(productItemId: string): Observable<ProductItemView> {
    return this.http
      .get<ProductItemView>(`${this.apiUrl}/get/${productItemId}`)
      .pipe(
        catchError((error) => {
          console.error('Error :', error);
          return throwError(() => error);
        })
      );
  }
}
