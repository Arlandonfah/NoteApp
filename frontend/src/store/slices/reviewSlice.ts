import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Review,
  ReviewCreate,
  ReviewFilters,
  ReviewStats,
} from "@/types/review";
import { PaginatedResponse } from "@/types/common";
import { reviewService } from "@/services/reviewService";
import toast from "react-hot-toast";

interface ReviewState {
  reviews: Review[];
  reviewStats: ReviewStats | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ReviewFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  reviewStats: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    sortBy: "createdAt",
    sortOrder: "DESC",
    page: 1,
    limit: 10,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (filters?: ReviewFilters) => {
    return await reviewService.getReviews(filters);
  }
);

export const createReview = createAsyncThunk(
  "reviews/createReview",
  async (reviewData: ReviewCreate) => {
    const review = await reviewService.createReview(reviewData);
    toast.success("Avis ajouté avec succès");
    return review;
  }
);

export const fetchReviewStats = createAsyncThunk(
  "reviews/fetchReviewStats",
  async (productId: number) => {
    return await reviewService.getReviewStats(productId);
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearReviews: (state) => {
      state.reviews = [];
      state.reviewStats = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Erreur lors du chargement des avis";
      })
      // Create review
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      // Fetch review stats
      .addCase(fetchReviewStats.fulfilled, (state, action) => {
        state.reviewStats = action.payload;
      });
  },
});

export const { setFilters, clearReviews, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
