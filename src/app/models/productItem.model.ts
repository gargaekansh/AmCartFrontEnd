import { DiscountType, VariantType } from './enums';
import {
  ImagesBase,
  ProductView,
  ProductWithSimilarBrand,
  ProductWithSimilarChoiceView,
  ProductWithSimilarGenderView,
} from './product.model';

export interface Discount {
  type: DiscountType;
  value: number;
}

//base classes
export interface ProductItemBase {
  productId: string;
  variantType: VariantType;
}

export interface ProductVariantBase {
  discount?: Discount;
  images: ImagesBase[];
}

export interface ProductVariantSizeColorBase {
  color: string; // for each color, we have multiple size options
  image: ImagesBase; // for each color, we need to add the image
  sizes: ProductVariantSizeWithIdBase[];
}

export interface ProductVariantColorBase {
  color: string;
  stockQuantity: number;
  price: number;
  discount?: Discount;
  image: ImagesBase;
}
export interface ProductVariantSizeWithIdBase extends ProductVariantSizeBase {
  id: string;
}

export interface ProductVariantSizeBase {
  size: string;
  stockQuantity: number;
  price: number;
  discount?: Discount;
  discountedPrice: number;
}

// main classes

export interface ProductVariantSizeView extends ProductVariantSizeBase {
  id: string;
}

export interface ProductVariantColorView extends ProductVariantColorBase {
  id: string;
  discountedPrice: number;
}

export interface ProductVariantSizeColor extends ProductVariantSizeColorBase {
  id: string;
}

export interface ProductVariant extends ProductVariantBase {
  id: string;
  isDiscountApplied: boolean;
  sizeVariant?: ProductVariantSizeView[];
  colorVariant?: ProductVariantColorView[];
  sizeColorVariant?: ProductVariantSizeColor[];
}

// post
export interface ProductItemCommand extends ProductItemBase {
  variant: ProductVariantCommand;
}

export interface ProductVariantCommand extends ProductVariantBase {
  sizeVariant?: ProductVariantSizeBase[];
  colorVariant?: ProductVariantColorBase[];
  sizeColorVariant?: ProductVariantSizeColorBase[];
  images: ImagesBase[];
}

// view

export interface ProductItemView extends ProductItemBase {
  id: string;
  variants: ProductVariantView;
  product: ProductView;
  similarCategory?: ProductWithSimilarGenderView;
  similarBrand?: ProductWithSimilarBrand;
  similarSubCategory?: ProductWithSimilarChoiceView;
}

export interface ProductVariantView extends ProductVariantBase {
  id: string;
  isDiscountApplied: boolean;
  sizeVariant?: ProductVariantSizeView[];
  colorVariant?: ProductVariantColorView[];
  sizeColorVariant?: ProductVariantSizeColor[];
}
