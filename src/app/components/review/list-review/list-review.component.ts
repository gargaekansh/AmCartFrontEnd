import { Component, Input, input } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { ReviewQuery } from '../../../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-review',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-review.component.html',
  styleUrl: './list-review.component.css',
})
export class ListReviewComponent {
  @Input() reviews: ReviewQuery[] = [];
  stars = [1, 2, 3, 4, 5];
  constructor(private reviewService: ReviewService) {}
  likeReview(id: string) {}
  dislikeReview(id: string) {}
}
