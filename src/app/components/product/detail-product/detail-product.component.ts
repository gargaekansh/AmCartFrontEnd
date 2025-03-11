import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
  ProductItemView,
  ProductVariantSizeColor,
} from '../../../models/productItem.model';
import { ActivatedRoute, Router } from '@angular/router';
import { VariantType } from '../../../models/enums';
import { ProductItemService } from '../../../services/productItem.service';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../models/cart.model';
import { TruncatePipe } from '../../../truncate.pipe';
import { ListReviewComponent } from '../../review/list-review/list-review.component';
import { AddReviewComponent } from '../../review/add-review/add-review.component';
import { AuthService } from '../../../services/auth.service';
import { LoaderComponent } from '../../common/loader/loader.component';
import { WishListBase } from '../../../models/wishlist.model';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { WishListService } from '../../../services/wishlist.service';
import { error } from 'console';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    TruncatePipe,
    ListReviewComponent,
    AddReviewComponent,
    LoaderComponent,
  ],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css',
  animations: [
    trigger('bounce', [
      state('normal', style({ transform: 'scale(1)' })),
      state('bounced', style({ transform: 'scale(1.1)' })),
      transition('normal => bounced', [
        animate(
          '0.5s cubic-bezier(0.4, 0, 0.6, 1)',
          keyframes([
            style({ transform: 'scale(1)', offset: 0 }),
            style({ transform: 'scale(1.2)', offset: 0.3 }),
            style({ transform: 'scale(1)', offset: 0.6 }),
            style({ transform: 'scale(1.1)', offset: 1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class DetailProductComponent implements OnInit {
  isImageZoomed = false;
  isDragging = false;
  startX = 0;
  startY = 0;
  offsetX = 0;
  offsetY = 0;
  lastX = 0;
  lastY = 0;

  @ViewChild('zoomImage', { static: false }) zoomImage!: ElementRef;

  productItem!: ProductItemView;
  selectedImageIndex = 0; // Track the currently selected image
  selectedVariant!: {
    label: string;
    value: string;
    price: number;
    stockQuantity: number;
    discountedPrice: number;
  }; // Track the selected variant
  currentPrice: number | null = null; // Track the current price
  discountPrice: number = 0; // Track the discounted price
  selectedColorIndex = 0; // Track the selected color index for ColorAndSize variant
  selectedColorId: string = '';
  cartItem: CartItem = {
    brand: '',
    imgUrl: '',
    name: '',
    discountedPrice: 0,
    price: 0,
    variantType: '',
    colorId: '',
    colorLabel: '',
    sizeId: '',
    sizeLabel: '',
    productId: '',
    productItemId: '',
    orderCount: 0,
    totalPrice: 0,
    stockQuantity: 0,
  };

  isLoggedIn: boolean = false;
  showAddReviewFlag: boolean = false;
  showLoading: boolean = true;
  wishListAdded: boolean = false;
  bounceState = 'default';
  constructor(
    private route: ActivatedRoute,
    private productItemService: ProductItemService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private wishListService: WishListService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductItem(productId);
    }

    // Subscribe to the userInfo$ observable to get updates
    this.authService.userInfo$.subscribe((userInfo) => {
      if (userInfo) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    });

    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
      console.log('user is athenticated');
    }
  }

  loadProductItem(productId: string): void {
    this.showLoading = true;
    this.productItemService.getProductItemById(productId).subscribe({
      next: (data) => {
        this.productItem = data;
        console.log('Product item detail', data);
        this.cartItem.brand = this.productItem.product.brand.name;
        this.cartItem.name = this.productItem.product.name;
        this.cartItem.variantType = this.productItem.variantType;
        this.cartItem.productId = data.productId;
        this.cartItem.productItemId = data.id;
        this.setVariantImages();
        this.setDefaultPrice();
        this.showLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product item:', err);
        this.showLoading = false;
      },
    });
  }

  setVariantImages() {
    if (this.productItem.variantType === VariantType.Color) {
      // Push all images from colorVariant
      if (this.productItem.variants.colorVariant) {
        this.productItem.variants.colorVariant.forEach((variant) => {
          if (variant.image) {
            this.productItem.variants.images.push(variant.image);
          }
        });
      }
    } else if (this.productItem.variantType === VariantType.ColorAndSize) {
      // Push all images from each sizeColorVariant entry
      if (this.productItem.variants.sizeColorVariant) {
        this.productItem.variants.sizeColorVariant.forEach((variant) => {
          this.productItem.variants.images.push(variant.image);
        });
      }
    }
  }

  setDefaultPrice(): void {
    if (!this.productItem || !this.productItem.variants) return;

    switch (this.productItem.variantType) {
      case VariantType.Size:
        this.selectedVariant = {
          label: this.productItem.variants.sizeVariant?.[0]?.size || '',
          value: this.productItem.variants.sizeVariant?.[0]?.id || '',
          price: this.productItem.variants.sizeVariant?.[0]?.price || 0,
          stockQuantity:
            this.productItem.variants.sizeVariant?.[0]?.stockQuantity || 0,
          discountedPrice:
            this.productItem.variants.sizeVariant?.[0]?.discountedPrice || 0,
        };
        this.currentPrice = this.selectedVariant.price;
        this.discountPrice = this.selectedVariant.discountedPrice;
        this.cartItem.price = this.currentPrice;
        this.cartItem.discountedPrice = this.discountPrice;
        this.cartItem.sizeId = this.productItem.variants.sizeVariant?.[0]?.id;
        this.cartItem.sizeLabel =
          this.productItem.variants.sizeVariant?.[0]?.size ?? '';

        this.cartItem.imgUrl = this.productItem.variants.images[0].url;
        this.cartItem.stockQuantity = this.selectedVariant.stockQuantity;

        break;
      case VariantType.Color:
        this.selectedVariant = {
          label: this.productItem.variants.colorVariant?.[0]?.color || '',
          value: this.productItem.variants.colorVariant?.[0]?.id || '',
          price: this.productItem.variants.colorVariant?.[0]?.price || 0,
          stockQuantity:
            this.productItem.variants.colorVariant?.[0]?.stockQuantity || 0,
          discountedPrice:
            this.productItem.variants.colorVariant?.[0]?.discountedPrice || 0,
        };
        this.currentPrice = this.selectedVariant.price;
        this.cartItem.price = this.currentPrice;
        this.cartItem.discountedPrice = this.selectedVariant.discountedPrice;
        this.cartItem.imgUrl =
          this.productItem.variants.colorVariant![0].image.url;
        this.cartItem.colorId = this.productItem.variants.colorVariant?.[0]?.id;
        this.cartItem.colorLabel =
          this.productItem.variants.colorVariant?.[0].color ?? '';

        this.discountPrice = this.selectedVariant.discountedPrice;
        this.cartItem.stockQuantity = this.selectedVariant.stockQuantity;
        this.selectedImageIndex = 0; // Set the main image to the first image of the selected color
        break;
      case VariantType.ColorAndSize:
        const firstColorVariant =
          this.productItem.variants.sizeColorVariant?.[0];

        const firstSizeVariant = firstColorVariant?.sizes?.[0];
        this.selectedVariant = {
          label: firstSizeVariant?.size || '',
          value: firstSizeVariant?.id || '',
          price: firstSizeVariant?.price || 0,
          stockQuantity: firstSizeVariant?.stockQuantity || 0,
          discountedPrice: firstSizeVariant?.discountedPrice || 0,
        };
        this.currentPrice = this.selectedVariant.price;
        this.cartItem.sizeId = this.selectedVariant.value;
        this.cartItem.sizeLabel = firstSizeVariant?.size ?? '';
        this.cartItem.colorId = firstColorVariant?.id;
        this.cartItem.colorLabel = firstColorVariant?.color ?? '';
        this.cartItem.price = this.currentPrice;
        this.cartItem.discountedPrice = this.selectedVariant.discountedPrice;
        this.cartItem.imgUrl = firstColorVariant?.image.url ?? '';
        this.productItem.variants.sizeColorVariant;
        this.discountPrice = this.selectedVariant.discountedPrice;
        this.cartItem.stockQuantity = this.selectedVariant.stockQuantity;
        this.selectedImageIndex = 0; // Set the main image to the first image of the selected color
        break;
      default:
        this.currentPrice = null;
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  getVariantType(): string {
    return this.productItem?.variantType || '';
  }

  getVariantButtons(): {
    label: string;
    value: string;
    price: number;
    stockQuantity: number;
    discountedPrice: number;
  }[] {
    if (!this.productItem || !this.productItem.variants) return [];

    const variant = this.productItem.variants;
    switch (this.productItem.variantType) {
      case VariantType.Size:
        return (
          variant.sizeVariant?.map((v) => ({
            label: v.size || '',
            value: v.id || '',
            price: v.price || 0,
            stockQuantity: v.stockQuantity || 0,
            discountedPrice: v.discountedPrice || 0,
          })) || []
        );

      case VariantType.Color:
        return (
          variant.colorVariant?.map((v) => ({
            label: v.color || '',
            value: v.id || '',
            price: v.price || 0,
            stockQuantity: v.stockQuantity || 0,
            discountedPrice: v.discountedPrice || 0,
          })) || []
        );

      case VariantType.ColorAndSize:
        const selectedColorVariant =
          variant.sizeColorVariant?.[this.selectedColorIndex];
        return (
          selectedColorVariant?.sizes?.map((s) => ({
            label: s.size || '',
            value: s.id || '',
            price: s.price || 0,
            stockQuantity: s.stockQuantity || 0,
            discountedPrice: s.discountedPrice || 0,
          })) || []
        );

      default:
        return [];
    }
  }

  onVariantSelect(button: {
    label: string;
    value: string;
    price: number;
    stockQuantity: number;
    discountedPrice: number;
  }): void {
    this.selectedVariant = button;
    this.currentPrice = button.price;
    this.discountPrice = button.discountedPrice;
    console.log(button);
    this.cartItem.discountedPrice = button.discountedPrice;
    this.cartItem.price = button.price;
    this.cartItem.stockQuantity = button.stockQuantity;

    // check the variant type
    // if color or size&color, then get the index of item and set

    if (this.productItem.variantType === VariantType.Color) {
      // Find index of the selected color variant
      const index = this.productItem.variants.colorVariant?.findIndex(
        (col) => col.id === button.value
      );
      this.selectedImageIndex = index !== undefined && index !== -1 ? index : 0;
      this.cartItem.colorId = button.value;
      this.cartItem.colorLabel = button.label;

      this.cartItem.imgUrl =
        this.productItem.variants.colorVariant?.[index ?? 0].image.url ?? '';
      this.cartItem.sizeId = '';
      this.cartItem.sizeLabel = '';
    } else if (this.productItem.variantType === VariantType.ColorAndSize) {
      // Find index of the selected size-color variant

      const index = this.productItem.variants.sizeColorVariant?.findIndex(
        (variant) => variant.sizes.some((col) => col.id == button.value)
      );
      const sizeIndexResult =
        index !== -1
          ? this.productItem.variants.sizeColorVariant?.[index ?? 0].sizes.find(
              (col) => col.id == button.value
            )
          : null;

      this.cartItem.imgUrl =
        this.productItem.variants.sizeColorVariant?.[index ?? 0].image.url ??
        '';

      this.cartItem.colorId =
        this.productItem.variants.sizeColorVariant?.[index ?? 0].id ?? '';
      this.cartItem.colorLabel =
        this.productItem.variants.sizeColorVariant?.[index ?? 0].color ?? '';
      this.cartItem.sizeId = button.value;
      this.cartItem.sizeLabel = button.label;
      //this.selectedImageIndex = index !== undefined && index !== -1 ? index : 0;
    } else {
      this.cartItem.sizeId = button.value;
      this.cartItem.sizeLabel = button.label;
    }
  }

  onColorSelect(index: number): void {
    this.selectedColorIndex = index;

    // Get the selected color variant
    const selectedColorVariant =
      this.productItem.variants.sizeColorVariant?.[index];
    this.selectedColorId = selectedColorVariant?.id ?? '';

    this.cartItem.colorId = selectedColorVariant?.id;
    this.cartItem.colorLabel = selectedColorVariant?.color ?? '';

    if (selectedColorVariant?.image.url != null) {
      const index = this.productItem.variants.sizeColorVariant?.findIndex(
        (col) => col.id === selectedColorVariant.id
      );
      this.cartItem.imgUrl = selectedColorVariant.image.url;
      this.selectedImageIndex = index !== undefined && index !== -1 ? index : 0;
    }

    if (selectedColorVariant?.sizes?.[0]) {
      const firstSizeVariant = selectedColorVariant.sizes[0];
      this.cartItem.sizeId = firstSizeVariant.id;
      this.cartItem.sizeLabel = firstSizeVariant.size;

      this.selectedVariant = {
        label: firstSizeVariant.size || '',
        value: firstSizeVariant.id || '',
        price: firstSizeVariant.price || 0,
        stockQuantity: firstSizeVariant.stockQuantity || 0,
        discountedPrice: firstSizeVariant.discountedPrice || 0,
      };
      this.currentPrice = this.selectedVariant.price;
      this.discountPrice = this.selectedVariant.discountedPrice;
      this.cartItem.price = this.selectedVariant.price;
      this.cartItem.discountedPrice = this.selectedVariant.discountedPrice;
      this.cartItem.stockQuantity = this.selectedVariant?.stockQuantity;
    }
  }

  toggleImageZoom(): void {
    this.isImageZoomed = !this.isImageZoomed;
  }

  getAvailableColorsForSize(size: string): string[] {
    if (
      !this.productItem ||
      !this.productItem.variants ||
      this.productItem.variantType !== VariantType.ColorAndSize
    )
      return [];

    return (
      this.productItem.variants.sizeColorVariant
        ?.filter((colorVariant: ProductVariantSizeColor) =>
          colorVariant.sizes.some((s) => s.size === size && s.stockQuantity > 0)
        )
        .map((colorVariant: ProductVariantSizeColor) => colorVariant.color) ??
      []
    );
  }
  addToBag() {
    const cartItemCopy = { ...this.cartItem };
    this.cartService.addToCart(cartItemCopy);
    // this.resetCartItem();
  }

  addToWishlist() {
    if (this.isLoggedIn) {
      const wishList: WishListBase = {
        productId: this.productItem.productId,
        productItemId: this.productItem.id,
      };
      this.wishListService.addToWishList(wishList).subscribe({
        next: () => {
          this.wishListAdded = true;
          this.bounceState = 'bounced';

          setTimeout(() => {
            this.bounceState = 'normal';
          }, 600);
        },
        error: (err) => {
          alert(err.message);
        },
      });
    } else {
      alert('You must be logged in to add into wishlist');
    }
  }
  resetCartItem() {
    this.cartItem.brand = '';
    this.cartItem.colorId = '';
    this.cartItem.colorLabel = '';
    this.cartItem.sizeId = '';
    this.cartItem.sizeLabel = '';
    this.cartItem.imgUrl = '';
    this.cartItem.discountedPrice = 0;
    this.cartItem.stockQuantity = 0;
    this.cartItem.price = 0;
  }

  // Calculate discount percentage
  calculateDiscount(price: {
    originalPrice: number;
    discountPrice: number;
  }): number {
    if (price.discountPrice > 0) {
      return Math.round(
        ((price.originalPrice - price.discountPrice) / price.originalPrice) *
          100
      );
    }
    return 0;
  }

  showAddReview() {
    this.showAddReviewFlag = true;
  }
  navigateToLogin() {
    this.router.navigate(['/user/login']);
  }

  openImageModal() {
    this.isImageZoomed = true;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  closeImageModal() {
    this.isImageZoomed = false;
  }

  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.offsetX;
    this.startY = event.clientY - this.offsetY;
  }

  dragImage(event: MouseEvent) {
    if (!this.isDragging) return;
    event.preventDefault();

    this.offsetX = event.clientX - this.startX;
    this.offsetY = event.clientY - this.startY;
  }

  stopDragging() {
    this.isDragging = false;
  }
}
