import ordersModel from "../model/Orders.js";
import productsModel from "../model/Products.js";
import billsModel from "../model/Bill.js";
import "../model/Customer.js";

const orderController = {};

const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return 0;
  if (typeof value === "object" && value.$numberDecimal) {
    return Number(value.$numberDecimal) || 0;
  }
  return Number(String(value).replace(/[^0-9.-]/g, "")) || 0;
};

const getProductPrice = (product) => {
  const data = product?.toObject ? product.toObject() : product;
  const fields = [
    "unitPrice", "UnitPrice", "price", "Price", "precio", "Precio",
    "precioUnitario", "PrecioUnitario", "unit_price", "cost", "Cost"
  ];

  for (const field of fields) {
    const value = parseNumber(data?.[field]);
    if (value > 0) return value;
  }

  const dynamicKey = Object.keys(data || {}).find((key) => {
    const lower = key.toLowerCase();
    return lower.includes("price") || lower.includes("precio");
  });

  if (dynamicKey) return parseNumber(data[dynamicKey]);
  return 0;
};

const getProductName = (product) =>
  product?.name || product?.nombre || product?.productName || product?._id;

const createBillIfDelivered = async (order) => {
  if (order.state !== "Entregado") return;
  const existingBill = await billsModel.findOne({ OrderId: order._id });
  if (existingBill) return;
  await billsModel.create({
    OrderId: order._id,
    date: new Date(),
    paymentMethod: order.paymentMethod || "No especificado",
  });
};

// Obtener todas las órdenes
orderController.getOrders = async (req, res) => {
  try {
    const orders = await ordersModel.find()
      .populate("products.productId", "name nombre productName unitPrice UnitPrice price Price precio Precio")
      .populate("customerId", "name lastName lastname nombre apellido email")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener órdenes de un cliente específico (para el historial)
orderController.getCustomerOrders = async (req, res) => {
  try {
    const { customerId } = req.params;
    
    const orders = await ordersModel.find({ customerId })
      .populate("products.productId", "name nombre productName unitPrice price")
      .sort({ createdAt: -1 })
      .limit(50);

    return res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ 
      success: false,
      message: "Error al obtener el historial de compras" 
    });
  }
};

// Crear una orden desde el carrito (finalizar compra)
orderController.createOrderFromCart = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { items, subtotal, shipping, total, paymentMethod, customerData } = req.body;

    // Validar stock de todos los productos
    for (const item of items) {
      const product = await productsModel.findById(item.productId).session(session);
      if (!product) {
        throw new Error(`Producto ${item.productName} no encontrado`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${item.productName}. Disponible: ${product.quantity}`
        );
      }
    }

    // Crear la orden usando la estructura existente
    const order = new ordersModel({
      products: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      location: customerData.address || "No especificada",
      date: new Date(),
      totalPrice: total,
      customerId: customerData._id,
      customerEmail: customerData.email,
      customerName: `${customerData.name} ${customerData.lastname || ""}`.trim(),
      paymentMethod: paymentMethod,
      state: "Entregado",
      status: "completed",
      orderDate: new Date()
    });

    await order.save({ session });

    // Actualizar el stock de los productos
    for (const item of items) {
      await productsModel.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    // Crear la factura automáticamente
    await createBillIfDelivered(order);

    res.status(201).json({
      success: true,
      message: "Compra realizada exitosamente",
      order
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error al crear orden:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Error al procesar la compra"
    });
  }
};

// Insertar orden (existente)
orderController.insertOrder = async (req, res) => {
  try {
    const { products, location, date, customerId, state } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Debe agregar productos al pedido" });
    }

    if (!location || !date || !customerId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let total = 0;
    const newProducts = [];

    for (let i = 0; i < products.length; i++) {
      const productFound = await productsModel.findById(products[i].productId);

      if (!productFound) {
        return res.status(404).json({
          message: `Producto no encontrado: ${products[i].productId}`,
        });
      }

      const quantity = Number(products[i].quantity);
      const dbPrice = getProductPrice(productFound);
      const modalPrice = getProductPrice(products[i]);
      const price = dbPrice > 0 ? dbPrice : modalPrice;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
      }

      if (!price || price <= 0) {
        return res.status(400).json({
          message: `Agrega un precio válido para ${getProductName(productFound)}`,
        });
      }

      const subtotal = price * quantity;
      total += subtotal;

      newProducts.push({
        productId: products[i].productId,
        quantity,
        subtotal,
      });
    }

    const newOrder = new ordersModel({
      products: newProducts,
      location: location.trim(),
      date,
      totalPrice: total,
      customerId,
      state: state || "Pendiente",
    });

    await newOrder.save();
    await createBillIfDelivered(newOrder);
    return res.status(200).json({
      message: "Orden insertada correctamente",
      order: newOrder,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Obtener órdenes por estado
orderController.getOrdersByState = async (req, res) => {
  try {
    const states = await ordersModel.aggregate([
      {
        $addFields: {
          realState: {
            $ifNull: [
              "$state",
              {
                $ifNull: [
                  "$estado",
                  {
                    $ifNull: ["$status", "Sin estado"],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$realState",
          total: { $sum: 1 },
        },
      },
      {
        $sort: {
          total: -1,
        },
      },
      {
        $project: {
          _id: 0,
          state: "$_id",
          total: 1,
        },
      },
    ]);

    return res.status(200).json(states);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Obtener órdenes recientes
orderController.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await ordersModel.find()
      .populate("products.productId", "name nombre productName unitPrice price")
      .populate("customerId", "name lastName lastname nombre apellido email")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json(recentOrders);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Actualizar orden
orderController.updateOrder = async (req, res) => {
  try {
    const { products, location, date, customerId, state } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Debe agregar productos al pedido" });
    }

    if (!location || !date || !customerId) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    let total = 0;
    const newProducts = [];

    for (let i = 0; i < products.length; i++) {
      const productFound = await productsModel.findById(products[i].productId);

      if (!productFound) {
        return res.status(404).json({
          message: `Producto no encontrado: ${products[i].productId}`,
        });
      }

      const quantity = Number(products[i].quantity);
      const dbPrice = getProductPrice(productFound);
      const modalPrice = getProductPrice(products[i]);
      const price = dbPrice > 0 ? dbPrice : modalPrice;

      if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
      }

      if (!price || price <= 0) {
        return res.status(400).json({
          message: `Agrega un precio válido para ${getProductName(productFound)}`,
        });
      }

      const subtotal = price * quantity;
      total += subtotal;

      newProducts.push({
        productId: products[i].productId,
        quantity,
        subtotal,
      });
    }

    const updatedOrder = await ordersModel.findByIdAndUpdate(
      req.params.id,
      {
        products: newProducts,
        location: location.trim(),
        date,
        totalPrice: total,
        customerId,
        state: state || "Pendiente",
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    await createBillIfDelivered(updatedOrder);

    return res.status(200).json({
      message: "Se actualizó la orden correctamente",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Eliminar orden
orderController.deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await ordersModel.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    return res.status(200).json({
      message: "Se eliminó la orden correctamente",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default orderController;