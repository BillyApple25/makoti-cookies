'use client';

import { useState, useEffect } from 'react';
import { ProductService } from '@/services/firebase/productService';
import { FirebaseProduct } from '@/types/firebase';

interface ProductsState {
  products: FirebaseProduct[];
  newProducts: FirebaseProduct[];
  bestsellerProducts: FirebaseProduct[];
  loading: boolean;
  error: string | null;
}

export function useProducts() {
  const [state, setState] = useState<ProductsState>({
    products: [],
    newProducts: [],
    bestsellerProducts: [],
    loading: true,
    error: null
  });

  const loadProducts = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const [allProducts, newProducts, bestsellerProducts] = await Promise.all([
        ProductService.getAllProducts(),
        ProductService.getNewProducts(),
        ProductService.getBestsellerProducts()
      ]);

      setState({
        products: allProducts,
        newProducts,
        bestsellerProducts,
        loading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load products'
      }));
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getProductById = async (id: string): Promise<FirebaseProduct | null> => {
    try {
      return await ProductService.getProductById(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  const getProductsByCategory = async (category: string): Promise<FirebaseProduct[]> => {
    try {
      return await ProductService.getProductsByCategory(category);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  };

  const setProductAsNew = async (id: string) => {
    try {
      await ProductService.setProductAsNew(id);
      await loadProducts(); // Refresh data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update product'
      }));
      throw error;
    }
  };

  const setProductAsBestseller = async (id: string) => {
    try {
      await ProductService.setProductAsBestseller(id);
      await loadProducts(); // Refresh data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update product'
      }));
      throw error;
    }
  };

  const clearAllNewStatuses = async () => {
    try {
      await ProductService.clearAllNewStatuses();
      await loadProducts(); // Refresh data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear new statuses'
      }));
      throw error;
    }
  };

  const clearAllBestsellerStatuses = async () => {
    try {
      await ProductService.clearAllBestsellerStatuses();
      await loadProducts(); // Refresh data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to clear bestseller statuses'
      }));
      throw error;
    }
  };

  const addProduct = async (productData: Omit<FirebaseProduct, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const productId = await ProductService.addProduct(productData);
      await loadProducts(); // Refresh data
      return productId;
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to add product'
      }));
      throw error;
    }
  };

  const updateProduct = async (id: string, updates: Partial<Omit<FirebaseProduct, 'id' | 'createdAt'>>) => {
    try {
      await ProductService.updateProduct(id, updates);
      await loadProducts(); // Refresh data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to update product'
      }));
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await ProductService.deleteProduct(id);
      await loadProducts(); // Refresh data
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete product'
      }));
      throw error;
    }
  };

  return {
    products: state.products,
    newProducts: state.newProducts,
    bestsellerProducts: state.bestsellerProducts,
    loading: state.loading,
    error: state.error,
    getProductById,
    getProductsByCategory,
    setProductAsNew,
    setProductAsBestseller,
    clearAllNewStatuses,
    clearAllBestsellerStatuses,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts
  };
} 