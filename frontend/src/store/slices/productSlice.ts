import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
} from "@/types/product";
import { PaginatedResponse } from "@/types/common";
import { productService } from "@/services/productService";
import toast from "react-hot-toast";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 12,
  },
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "DESC",
    page: 1,
    limit: 12,
  },
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters?: ProductFilters) => {
    return await productService.getProducts(filters);
  }
);

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (id: number) => {
    return await productService.getProduct(id);
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: ProductCreate) => {
    const product = await productService.createProduct(productData);
    toast.success("Produit créé avec succès");
    return product;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }: { id: number; productData: ProductUpdate }) => {
    const product = await productService.updateProduct(id, productData);
    toast.success("Produit mis à jour avec succès");
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await productService.deleteProduct(id);
    toast.success("Produit supprimé avec succès");
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Erreur lors du chargement des produits";
      })
      // Fetch single product
      .addCase(fetchProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Erreur lors du chargement du produit";
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || "Erreur lors de la création du produit";
      })
      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      });
  },
});

export const { setFilters, clearCurrentProduct, clearError } =
  productSlice.actions;
export default productSlice.reducer;
