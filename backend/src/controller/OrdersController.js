import ordersModel from "../model/Orders.js";
import productsModel from "../model/Products.js";
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
    "unitPrice",
    "UnitPrice",
    "price",
    "Price",
    "precio",
    "Precio",
    "precioUnitario",
    "PrecioUnitario",
    "unit_price",
    "cost",
    "Cost",
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

orderController.getOrders = async (req, res) => {
  try {
    const orders = await ordersModel.find()
      .populate(
        "products.productId",
        "name nombre productName unitPrice UnitPrice price Price precio Precio precioUnitario PrecioUnitario"
      )
      .populate("customerId", "name lastName lastname nombre apellido email")
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    console.log("error " + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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
        unitPrice: price,
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

    return res.status(200).json({
      message: "Orden insertada correctamente",
      order: newOrder,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

orderController.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await ordersModel.find()
      .populate(
        "products.productId",
        "name nombre productName unitPrice UnitPrice price Price precio Precio precioUnitario PrecioUnitario"
      )
      .populate("customerId", "name lastName lastname nombre apellido email")
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json(recentOrders);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

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
        unitPrice: price,
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

    return res.status(200).json({
      message: "Se actualizó la orden correctamente",
      order: updatedOrder,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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