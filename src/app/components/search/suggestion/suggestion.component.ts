import { Component, ElementRef, HostListener } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import {
  Subject,
  debounceTime,
  distinctUntilChanged,
  of,
  switchMap,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchResponse } from '../../../models/searchResponse.model';
import { ProductService } from '../../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggestion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suggestion.component.html',
  styleUrl: './suggestion.component.css',
})
export class SuggestionComponent {
  searchQuery = '';
  suggestions: SearchResponse[] = [];
  searchSubject = new Subject<string>();

  constructor(
    private searchService: SearchService,
    private router: Router,
    private elementRef: ElementRef
  ) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length < 3) {
            this.suggestions = []; // Clear suggestions when query < 3
            return of([]); // Return an empty observable
          }
          return this.searchService.search(query);
        })
      )
      .subscribe((results) => {
        this.suggestions = results;
      });
  }

  onInputChange() {
    this.searchSubject.next(this.searchQuery);
  }

  selectSuggestion(suggestion: any) {
    this.searchQuery = suggestion.text;
    this.suggestions = [];
    this.searchService.updateSearchQuery(suggestion.value);
    this.router.navigate(['/products']);
  }
  highlightMatch(text: string): string {
    if (!this.searchQuery) return text;
    const regex = new RegExp(`(${this.searchQuery})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.suggestions = []; // Clear suggestions
      this.searchQuery = ''; // Clear input if needed
    }
  }
}
