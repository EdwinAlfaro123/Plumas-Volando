import api from './api';

export const invoiceService = {
  // Obtener facturas del cliente
  getInvoices: async (customerId) => {
    try {
      const response = await api.get(`/bills/customer/${customerId}`);
      return { success: true, invoices: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener facturas',
      };
    }
  },

  // Obtener detalle de una factura específica
  getInvoiceDetail: async (invoiceId) => {
    try {
      const response = await api.get(`/bills/${invoiceId}`);
      return { success: true, invoice: response.data };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener detalle de factura',
      };
    }
  }
};

export default invoiceService;