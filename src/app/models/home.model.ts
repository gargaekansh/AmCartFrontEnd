import { ProductView2 } from './product2.model';
// import { ProductItemView } from './productItem2.model';

// export interface HomePage {
//   men: ProductView[];
//   women: ProductView[];
// }


// import { ProductView } from './product.model';

export interface HomePage {
  products: ProductView2[]; // Store products as a single array
}