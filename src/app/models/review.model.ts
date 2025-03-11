import { Image64Bit, ImagesBase } from './product.model';
import { AuthenticatedUser } from './user.model';

export interface ReviewBase {
  productId: string;
  productItemId: string;
  rating: number;
  comment?: string;
  images?: Image64Bit[];
}

export interface RepliedComment {
  id: string;
  user: AuthenticatedUser;
  comment: string;
  createdAt: Date;
}

export interface ReviewDb extends ReviewBase {
  id: string;
  user: AuthenticatedUser;
  like: number;
  dislike: number;
  createdAt: Date;
  isVerifiedPurchase: boolean;
  replies?: RepliedComment[];
}

export interface ReviewCommand extends ReviewBase {}

export interface ReviewQuery extends ReviewDb {}
