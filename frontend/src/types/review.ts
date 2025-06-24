export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewCreate {
  productId: number;
  rating: number;
  comment?: string;
}

export interface ReviewFilters {
  productId?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "ASC" | "DESC";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: {
    [key: number]: number;
  };
}
