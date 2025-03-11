import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WishListBase, WishListQuery } from '../models/wishlist.model';
@Injectable({
  providedIn: 'root',
})
export class WishListService {
  private apiUrl = environment.productApiUrl;
  private wishlistSubject = new BehaviorSubject<WishListQuery[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private http: HttpClient) {}

  addToWishList(wishlist: WishListBase): Observable<any> {
    return this.http
      .post<WishListQuery[]>(`${this.apiUrl}/wishlist/add`, wishlist)
      .pipe(
        catchError((error) => {
          return throwError(() => error.error);
        })
      );
  }

  GetWishlists(): void {
    this.http.get<WishListQuery[]>(`${this.apiUrl}/wishlist/get`).subscribe({
      next: (wishlist) => this.wishlistSubject.next(wishlist),
      error: (err) => console.error('Error fetching wishlist:', err),
    });
  }

  RemoveWishlist(id: string): void {
    this.http.delete(`${this.apiUrl}/wishlist/remove/${id}`).subscribe({
      next: () => {
        this.GetWishlists(); // Fetch updated wishlist after deletion
      },
      error: (error) => {
        console.error('Error:', error.error);
      },
    });
  }
}
