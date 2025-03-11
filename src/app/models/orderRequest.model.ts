import { CartItem } from './cart.model';
import { User } from './user.model';

export interface OrderRequest {
  cartItems: CartItem[];
  user: User;
  paymentMode: string;
  totalCost: number;
}

export interface OrderConfirmed extends OrderRequest {
  invoiceId: string;
  orderStatus: string;
}

export interface OrderQuery {
  id: string;
  createdOn: Date;
  paymentMode: string;
  totalCost: number;
  itemsCount: number;
}

export interface OrderDetailQuery extends OrderQuery {
  cartItems: CartItem[];
}
