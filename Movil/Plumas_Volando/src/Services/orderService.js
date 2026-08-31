import api from './api';

export const orderService = {
  // Obtener pedidos del cliente
  getOrders: async (customerId) => {
    try {
      const response = await api.get(`/orders/customer/${customerId}`);
      return { success: true, orders: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener pedidos',
      };
    }
  },

  // Crear un nuevo pedido
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
  }
};

export default orderService;