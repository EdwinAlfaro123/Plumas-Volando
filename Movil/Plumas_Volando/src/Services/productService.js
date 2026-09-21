import api from './api';

export const productService = {
    // Obtener productos con filtros y búsqueda
    getProducts: async (params = {}) => {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.search) queryParams.append('search', params.search);
            if (params.category) queryParams.append('category', params.category);
            if (params.minPrice) queryParams.append('minPrice', params.minPrice);
            if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
            if (params.sort) queryParams.append('sort', params.sort);

            const response = await api.get(`/products?${queryParams.toString()}`);
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