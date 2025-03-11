const productApiUrl: string = 'http://localhost:5267';
const userApiUrl: string = 'http://localhost:5190';
const searchApiUrl: string = 'http://localhost:5204';

export const environment = {
  production: false,
  categoryApiUrl: `${productApiUrl}/api/category`, // GKE API
  productApiUrl: `${productApiUrl}/api/product`,
  homeApiUrl: `${productApiUrl}/api/home`,
  productItemApiUrl: `${productApiUrl}/api/product/item`,
  reviewUrl: `${productApiUrl}/api/product/review`,

  searchApiUrl: `${searchApiUrl}/api/search`,

  userApiUrl: `${userApiUrl}/api/user`,
};
