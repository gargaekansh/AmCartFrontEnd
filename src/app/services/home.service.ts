import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProductView2 } from '../models/product2.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.homeApiUrl; // Update with your API URL

  constructor(private http: HttpClient) {}

  getHomePage(): Observable<ProductView2[]> {
    // return this.http.get<ProductView2[]>(`${this.apiUrl}/home`).pipe(
      return this.http.get<ProductView2[]>(`${this.apiUrl}`).pipe(
      catchError((error) => {
        console.error('Error fetching home page data:', error);
        return of([]); // Return an empty array in case of an error
      })
    );
  }
}
