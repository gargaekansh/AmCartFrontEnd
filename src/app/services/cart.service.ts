import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  // Observable streams for the components to subscribe to
  cartCount$ = this.cartCountSubject.asObservable();
  cartItems$ = this.cartItemsSubject.asObservable();

  // New BehaviorSubject for popup state and data
  private showPopupSubject = new BehaviorSubject<boolean>(false);
  private popupDataSubject = new BehaviorSubject<CartItem | null>(null);

  showPopup$ = this.showPopupSubject.asObservable(); // Observable for popup visibility
  popupData$ = this.popupDataSubject.asObservable(); // Observable for popup data

  constructor() {
    this.loadCartFromLocalStorage();
  }

  addToCart(item: CartItem) {
    let existingItem: CartItem | undefined;

    if (item.variantType === 'Size') {
      existingItem = this.cartItems.find(
        (cartItem) => cartItem.sizeId === item.sizeId
      );
    } else if (item.variantType === 'Color') {
      existingItem = this.cartItems.find(
        (cartItem) => cartItem.colorId === item.colorId
      );
    } else if (item.variantType === 'SizeAndColor') {
      existingItem = this.cartItems.find(
        (cartItem) =>
          cartItem.sizeId === item.sizeId && cartItem.colorId === item.colorId
      );
    }
    console.log('existingItem', existingItem);
    if (existingItem) {
      // If the item exists, increase the orderCount
      if (existingItem.stockQuantity > existingItem.orderCount) {
        existingItem.orderCount = (existingItem.orderCount || 1) + 1;
      }
    } else {
      // If item does not exist, initialize orderCount and add to cart
      item.orderCount = 1;
      this.cartItems.push({ ...item }); // Ensure a new copy is stored
    }

    this.cartCountSubject.next(
      this.cartItems.reduce((total, cartItem) => total + cartItem.orderCount, 0)
    );
    this.cartItemsSubject.next([...this.cartItems]); // Emit new array reference

    this.saveCartToLocalStorage();
    // Pass the updated or newly added item to the popup
    this.showPopup(existingItem ? { ...existingItem } : { ...item });
  }

  // Show the popup with data
  showPopup(item: CartItem) {
    this.popupDataSubject.next(item);
    this.showPopupSubject.next(true);

    // Auto-hide the popup after 3 seconds
    setTimeout(() => {
      this.hidePopup();
    }, 3000);
  }

  // Hide the popup
  hidePopup() {
    this.showPopupSubject.next(false);
  }
  getCartItems(): Observable<CartItem[]> {
    // Try to get data from BehaviorSubject first
    let currentCart = this.cartItemsSubject.value;

    // If the cart in the subject is empty, fetch from local storage
    if (!currentCart || currentCart.length === 0) {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        currentCart = JSON.parse(storedCart);
        this.cartItemsSubject.next(currentCart); // Update BehaviorSubject
      }
    }

    return this.cartItemsSubject.asObservable();
  }

  // Remove item from the cart
  removeItem(item: CartItem): void {
    const index = this.cartItems.indexOf(item);
    if (index !== -1) {
      this.cartItems.splice(index, 1);
      this.cartCountSubject.next(this.cartItems.length);
      this.cartItemsSubject.next([...this.cartItems]);
      this.saveCartToLocalStorage();
    }
  }

  updateCartItem(item: CartItem, increment: boolean): void {
    const existingItem = this.findCartItem(item);
    console.log('existingItem', existingItem);
    if (existingItem) {
      // Update the order count
      if (increment) {
        if (existingItem.stockQuantity > existingItem.orderCount) {
          existingItem.orderCount++;
        }
      } else {
        if (existingItem.orderCount > 1) {
          existingItem.orderCount--;
        }
      }
      console.log('existingItem', existingItem);
      // Recalculate the total price for this item
      existingItem.totalPrice =
        existingItem.orderCount *
        (existingItem.discountedPrice !== 0
          ? existingItem.discountedPrice
          : existingItem.price);

      // Emit the updated cart items
      this.cartItemsSubject.next([...this.cartItems]);
      this.saveCartToLocalStorage();
    }
  }
  removeFromCart() {
    localStorage.removeItem('cartItems');
    this.cartItems = [];
  }
  // Find an item in the cart based on variantType (size, color, etc.)
  private findCartItem(item: CartItem): CartItem | undefined {
    console.log('findCartItem', item);
    return this.cartItems.find(
      (cartItem) =>
        (cartItem.variantType === 'Size' && cartItem.sizeId === item.sizeId) ||
        (cartItem.variantType === 'Color' &&
          cartItem.colorId === item.colorId) ||
        (cartItem.variantType === 'ColorAndSize' &&
          cartItem.sizeId === item.sizeId &&
          cartItem.colorId === item.colorId)
    );
  }

  // Save cart items to localStorage or sessionStorage for persistence
  private saveCartToLocalStorage(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  // Load cart items from localStorage or sessionStorage (for persistence)
  private loadCartFromLocalStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const storedCartItems = localStorage.getItem('cartItems');
      if (storedCartItems) {
        this.cartItems = JSON.parse(storedCartItems);
        this.cartCountSubject.next(this.cartItems.length);
        this.cartItemsSubject.next(this.cartItems);
      }
    }
  }
}
