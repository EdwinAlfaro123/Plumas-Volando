import api from './api';

export const orderService = {
  getOrders: async (customerId) => {
    try {
      // app.js monta este router en /api/orders; la subruta definida es /orders/customer/:id.
      const response = await api.get(`/orders/orders/customer/${customerId}`);
      return {
        success: true,
        orders: Array.isArray(response.data) ? response.data : (response.data?.orders || []),
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'No fue posible obtener tus pedidos',
      };
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders/order/from-cart', orderData);
      return { success: true, order: response.data.order };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear pedido',
      };
    }
  },
};

export default orderService;