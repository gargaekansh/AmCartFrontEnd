import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ReviewCommand, ReviewQuery } from '../models/review.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  apiUrl = environment.reviewUrl;
  constructor(private http: HttpClient) {}

  addReview(review: ReviewCommand): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, review).pipe(
      catchError((error) => {
        console.error('Error :', error);
        return throwError(() => error);
      })
    );
  }

  getReviewsByProductId(productId: string): Observable<ReviewQuery[]> {
    return this.http
      .get<ReviewQuery[]>(`${this.apiUrl}/product/${productId}`)
      .pipe(
        catchError((error) => {
          console.error('Error :', error);
          return throwError(() => error);
        })
      );
  }
}
