import { apiService } from "./api";
import {
  Review,
  ReviewCreate,
  ReviewFilters,
  ReviewStats,
} from "@/types/review";
import { PaginatedResponse } from "@/types/common";

export const reviewService = {
  async getReviews(
    filters?: ReviewFilters
  ): Promise<PaginatedResponse<Review>> {
    const response = await apiService.get<PaginatedResponse<Review>>(
      "/reviews",
      filters
    );
    return response.data!;
  },

  async getReview(id: number): Promise<Review> {
    const response = await apiService.get<Review>(`/reviews/${id}`);
    return response.data!;
  },

  async createReview(reviewData: ReviewCreate): Promise<Review> {
    const response = await apiService.post<Review>("/reviews", reviewData);
    return response.data!;
  },

  async getReviewStats(productId: number): Promise<ReviewStats> {
    const response = await apiService.get<ReviewStats>(
      `/reviews/stats/${productId}`
    );
    return response.data!;
  },
};
