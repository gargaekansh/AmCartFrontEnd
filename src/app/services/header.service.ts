import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CategoryView } from '../models/category.model';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private apiUrl = environment.productApiUrl; // Update with your API URL
  constructor(private http: HttpClient) {}

  // getCategories(): Observable<CategoryView[]> {
  //   return this.http.get<CategoryView[]>(`${this.apiUrl}/categories`).pipe(
  //     catchError((error) => {
  //       console.error('Error :', error);
  //       return throwError(() => error);
  //     })
  //   );
  // }

  // getCategories(): Observable<CategoryView[]> {
  //   return this.http.get<CategoryView[]>(`${this.apiUrl}/categories`).pipe(
  //     catchError((error) => {
  //       console.error('Error :', error);
  //       return of([{} as CategoryView]); // Return an array with an empty CategoryView object in case of an error
  //     })
  //   );
  // }

  getCategories(): Observable<CategoryView[]> {
    // Return an array with an empty CategoryView object without calling the API
    return of([{} as CategoryView]);
  }
}
// }
