import { ProductView } from './product.model';
import { ProductItemView } from './productItem.model';

export interface HomePage {
  men: ProductView[];
  women: ProductView[];
}
