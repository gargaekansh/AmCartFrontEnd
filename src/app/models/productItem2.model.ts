import { Rating } from './rating.model';

/**
 * Represents a product Item
 */
export interface ProductItem2 {
  /**
   * Unique identifier for the product.
   */
  id: number;

  /**
   * Name of the product (optional).
   */
  name?: string;

  /**
   * Price of the product.
   */
  price: number;

  /**
   * Description of the product (optional).
   */
  description?: string;

  /**
   * Category to which the product belongs (optional).
   */
  category?: string;

  /**
   * URL of the product image (optional).
   */
  image?: string;

  /**
   * Rating details of the product (optional).
   */
  rating?: Rating;
}

