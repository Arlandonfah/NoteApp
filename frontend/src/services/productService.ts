// frontend/src/services/productService.ts
import { apiService } from "./api";
import {
  Product,
  ProductCreate,
  ProductUpdate,
  ProductFilters,
} from "@/types/product";
import { PaginatedResponse } from "@/types/common";

export const productService = {
  async getProducts(
    filters?: ProductFilters
  ): Promise<PaginatedResponse<Product>> {
    const response = await apiService.get<PaginatedResponse<Product>>(
      "/products",
      filters
    );
    return response.data!;
  },

  async getProduct(id: number): Promise<Product> {
    const response = await apiService.get<Product>(`/products/${id}`);
    return response.data!;
  },

  async createProduct(productData: ProductCreate): Promise<Product> {
    const formData = new FormData();
    formData.append("title", productData.title);
    formData.append("description", productData.description);
    formData.append("price", productData.price.toString());

    if (productData.image) {
      formData.append("image", productData.image);
    }

    const response = await apiService.postFormData<Product>(
      "/products",
      formData
    );
    return response.data!;
  },

  async updateProduct(
    id: number,
    productData: ProductUpdate
  ): Promise<Product> {
    const formData = new FormData();

    if (productData.title) {
      formData.append("title", productData.title);
    }
    if (productData.description) {
      formData.append("description", productData.description);
    }
    if (productData.price) {
      formData.append("price", productData.price.toString());
    }
    if (productData.image) {
      formData.append("image", productData.image);
    }

    const response = await apiService.putFormData<Product>(
      `/products/${id}`,
      formData
    );
    return response.data!;
  },

  async deleteProduct(id: number): Promise<void> {
    await apiService.delete(`/products/${id}`);
  },
};
