/**
 * Represents a product Item
 */
export interface Product {
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

/**
 * Represents the rating details of a product.
 */
export interface Rating {
  /**
   * Rating score (e.g., out of 5).
   */
  rate: number;

  /**
   * Number of users who rated the product.
   */
  count: number;
}
