export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image?: string;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreate {
  title: string;
  description: string;
  price: number;
  image?: File;
}

export interface ProductUpdate {
  title?: string;
  description?: string;
  price?: number;
  image?: File;
}

export interface ProductFilters {
  search?: string;
  sortBy?: "title" | "price" | "createdAt" | "averageRating";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}



