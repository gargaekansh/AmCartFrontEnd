import { Component, Input, NgModule } from '@angular/core';
import { ReviewService } from '../../../services/review.service';
import { ReviewCommand, ReviewQuery } from '../../../models/review.model';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Image64Bit } from '../../../models/product.model';

@Component({
  selector: 'app-add-review',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css',
})
export class AddReviewComponent {
  @Input() productId!: string;
  @Input() productItemId!: string;

  selectedImages: Image64Bit[] = [];
  reviewForm!: FormGroup;
  currentRating: number = 1;
  stars = [1, 2, 3, 4, 5];

  newReview: ReviewCommand = {
    productId: '',
    productItemId: '',
    rating: 0,
    comment: '',
    images: [],
  };

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      productId: [''],
      rating: [0],
      comment: [''],
      images: [null],
    });
  }

  addReview(): void {
    const reviewData: ReviewCommand = {
      productId: this.productId,
      productItemId: this.productItemId,
      rating: this.reviewForm.value.rating,
      comment: this.reviewForm.value.comment,
      images: this.selectedImages, // Send base64 images to backend
    };

    this.reviewService.addReview(reviewData).subscribe({
      next: () => {
        alert('Review has added successfully');
      },
      error: (err) => console.error('Error adding review', err),
    });
  }
  onFileChange(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image: Image64Bit = {
          url: '', // URL will be set by backend
          base64Data: e.target.result.split(',')[1], // Extract base64 content
        };
        this.selectedImages.push(image);
      };
      reader.readAsDataURL(file);
    }
  }
  setRating(index: number): void {
    this.currentRating = index + 1; // Update rating based on clicked star
    this.reviewForm.patchValue({ rating: this.currentRating }); // Update form control value for rating
  }
}
