import api from './api';

export const productService = {
  // Obtener todos los productos
  getProducts: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/products?page=${page}&limit=${limit}`);
      return { 
        success: true, 
        products: response.data.products || response.data,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        totalItems: response.data.totalItems || (response.data.length || 0)
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener productos',
      };
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return { success: true, product: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear producto',
      };
    }
  },

  rateProduct: async (productId, review) => {
    try {
      const response = await api.post(`/products/${productId}/rate`, { review });
      return { success: true, product: response.data.product };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al calificar producto',
      };
    }
  }
};

export default productService;