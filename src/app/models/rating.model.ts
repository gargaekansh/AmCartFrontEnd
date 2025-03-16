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