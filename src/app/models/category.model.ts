export interface CategoryView {
  id: string;
  name: string;
  gender: string;
  subCategories: SubCategoryView[];
}

export interface SubCategoryView {
  id: string;
  name: string;
  slug: string;
}
