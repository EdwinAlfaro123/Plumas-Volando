import express from 'express';
import ordersModel from '../model/Orders.js';
import { validateAuthCookie } from '../middlewares/authMiddleware.js';

const router = express.Router();

const isPending = (order) => ['pendiente', 'pending'].includes(String(order.state || order.status || '').toLowerCase());
const isCompleted = (order) => ['entregado', 'completed', 'completado'].includes(String(order.state || order.status || '').toLowerCase());
const orderDate = (order) => new Date(order.orderDate || order.date || order.createdAt);
const orderTotal = (order) => Number(order.totalPrice ?? order.total ?? 0) || 0;

router.get('/', validateAuthCookie(['customer']), async (req, res) => {
  try {
    const orders = await ordersModel
      .find({ customerId: req.userId })
      .select('state status totalPrice total orderDate date createdAt')
      .lean();

    const now = new Date();
    const monthTotal = orders.reduce((total, order) => {
      const date = orderDate(order);
      const belongsToCurrentMonth = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      return isCompleted(order) && belongsToCurrentMonth ? total + orderTotal(order) : total;
    }, 0);

    return res.status(200).json({
      success: true,
      summary: {
        pendingOrders: orders.filter(isPending).length,
        monthlySpent: monthTotal,
      },
    });
  } catch (error) {
    console.error('Error obteniendo resumen de inicio:', error);
    return res.status(500).json({
      success: false,
      message: 'No fue posible obtener el resumen de compras',
    });
  }
});

export default router;
