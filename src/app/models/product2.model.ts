// import { CategoryView, SubCategoryView } from './category.model';
// import { ReviewQuery } from './review.model';
import { Rating } from './rating.model';

// export interface ProductView {
//   id: string;
//   productItemId: string;
//   name: string;
//   description: string;
//   brand: Brand;
//   price: PriceBase;
//   images: ImagesBase[];
//   reviews: ReviewQuery[];
// }

export interface ProductView2 {
  id: number;
  //productItemId: number;
  name: string;
  description: string;
  // brand: Brand;
   price: number;
   rating?: Rating;
  // images: ImagesBase[];
   //reviews: ReviewQuery[];
   category: string;
   image: string;
}

// export interface PriceBase {
//   originalPrice: number;
//   discountPrice: number;
//   discount: Discount;
// }

// export interface ImagesBase {
//   url: string;
//   altText: string;
//   isPrimary: boolean;
//   orderNumber: number;
// }
// export interface Image64Bit {
//   url: string;
//   base64Data?: string;
// }

// export interface Brand {
//   id: string;
//   name: string;
// }

// export interface Discount {
//   type: string;
//   value: number;
//   startDate: string; // You can use 'string' to represent ISO 8601 date format (e.g., '2025-02-09T00:00:00Z')
//   endDate: string; // Same here for consistency
// }

export interface ProductItemFilterContents2 {
  id: string;
  // price: PriceBase;
  // images: ImagesBase[];
  price: number;
  image: string;
}

export interface ProductFilterView2 {
  id: number;
  name: string;
  description: string;
  //brand: Brand;
  productItems: ProductItemFilterContents2[];
}

// export interface ProductItemFilterFlatten {
//   id: string;
//   name: string;
//   description: string;
//   brand: Brand;
//   productItemId: string;
//   price: PriceBase;
//   images: ImagesBase[];
// }

// export interface ProductWithSimilarGenderView {
//   category: CategoryView;
//   products: ProductView[];
// }

// export interface ProductWithSimilarChoiceView {
//   subCategory: SubCategoryView;
//   products: ProductView[];
// }

// export interface ProductWithSimilarBrand {
//   brand: Brand;
//   products: ProductView[];
// }
