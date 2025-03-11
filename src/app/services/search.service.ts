import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SearchResponse } from '../models/searchResponse.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private apiUrl = environment.searchApiUrl; // Update with your API URL

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  constructor(private http: HttpClient) {}

  search(query: string): Observable<SearchResponse[]> {
    return this.http
      .get<SearchResponse[]>(`${this.apiUrl}?query=${query}`)
      .pipe(
        catchError((error) => {
          console.error('Error :', error);
          return throwError(() => error);
        })
      );
  }

  // Method to update the search query
  updateSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }
}
