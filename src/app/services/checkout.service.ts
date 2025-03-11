import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private userData: any;

  setUserData(user: User) {
    this.userData = user;
  }

  getUserData(): User {
    return this.userData;
  }
}
