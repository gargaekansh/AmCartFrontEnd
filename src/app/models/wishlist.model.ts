import { Brand } from './product.model';

export interface WishListBase {
  productId: string;
  productItemId: string;
}

export interface WishListQuery extends WishListBase {
  id: string;
  imageUrl: string;
  name: string;
  brand: Brand;
  price: number;
}
