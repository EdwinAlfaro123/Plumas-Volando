import productsModel from "../model/Products.js";
import ordersModel from "../model/Orders.js";
import { v2 as cloudinary } from "cloudinary";

const productsController = {};

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
    "productPrice",
    "ProductPrice",
    "precioProducto",
    "PrecioProducto",
    "cost",
    "Cost",
    "costo",
    "Costo",
  ];

  for (const field of fields) {
    const price = parseNumber(data?.[field]);
    if (price > 0) return price;
  }

  const dynamicKey = Object.keys(data || {}).find((key) => {
    const lowerKey = key.toLowerCase();
    return (
      lowerKey.includes("price") ||
      lowerKey.includes("precio") ||
      lowerKey.includes("costo") ||
      lowerKey.includes("cost")
    );
  });

  if (dynamicKey) return parseNumber(data[dynamicKey]);

  return 0;
};

const normalizeProduct = (product) => {
  const data = product?.toObject ? product.toObject() : product;
  const price = getProductPrice(data);

  return {
    ...data,
    name: data.name || data.nombre || data.productName || "Producto",
    unitPrice: price,
    price,
  };
};

productsController.getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.find().lean();
    const normalizedProducts = products.map(normalizeProduct);

    return res.status(200).json(normalizedProducts);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

productsController.insertProduct = async (req, res) => {
  try {
    const {
      name,
      TypeProduct,
      description,
      quantity,
      review,
      unitPrice,
      price,
      precio,
      Precio,
      precioUnitario,
      productPrice,
    } = req.body;

    const finalPrice = parseNumber(
      unitPrice ?? price ?? precio ?? Precio ?? precioUnitario ?? productPrice
    );

    if (!name || !TypeProduct || !description) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({ message: "El precio del producto debe ser mayor a 0" });
    }

    const newProduct = new productsModel({
      name: name.trim(),
      TypeProduct,
      description: description.trim(),
      unitPrice: finalPrice,
      price: finalPrice,
      quantity: Number(quantity) || 0,
      review,
      image: req.file?.path || "",
      public_id: req.file?.filename || "",
    });

    await newProduct.save();

    return res.status(200).json({ message: "Product saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

productsController.updateProduct = async (req, res) => {
  try {
    const {
      name,
      TypeProduct,
      description,
      quantity,
      review,
      unitPrice,
      price,
      precio,
      Precio,
      precioUnitario,
      productPrice,
    } = req.body;

    const productFound = await productsModel.findById(req.params.id);

    if (!productFound) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const finalPrice = parseNumber(
      unitPrice ?? price ?? precio ?? Precio ?? precioUnitario ?? productPrice
    );

    if (!name || !TypeProduct || !description) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    if (!finalPrice || finalPrice <= 0) {
      return res.status(400).json({ message: "El precio del producto debe ser mayor a 0" });
    }

    const updatedData = {
      name: name.trim(),
      TypeProduct,
      description: description.trim(),
      unitPrice: finalPrice,
      price: finalPrice,
      quantity: Number(quantity) || 0,
      review,
    };

    if (req.file) {
      if (productFound.public_id) {
        await cloudinary.uploader.destroy(productFound.public_id);
      }

      updatedData.image = req.file.path;
      updatedData.public_id = req.file.filename;
    }

    await productsModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    return res.status(200).json({ message: "Product updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

productsController.deleteProduct = async (req, res) => {
  try {
    const productFound = await productsModel.findById(req.params.id);

    if (!productFound) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (productFound.public_id) {
      await cloudinary.uploader.destroy(productFound.public_id);
    }

    await productsModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

productsController.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await ordersModel.aggregate([
      {
        $match: {
          state: "Entregado",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "Products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $unwind: {
          path: "$productInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$products.productId",
          name: {
            $first: {
              $ifNull: ["$productInfo.name", "Producto"],
            },
          },
          quantitySold: {
            $sum: "$products.quantity",
          },
          totalSold: {
            $sum: {
              $ifNull: ["$products.subtotal", 0],
            },
          },
        },
      },
      {
        $sort: {
          quantitySold: -1,
        },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 0,
          idProduct: "$_id",
          name: 1,
          quantitySold: 1,
          totalSold: 1,
        },
      },
    ]);

    return res.status(200).json(topProducts);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default productsController;