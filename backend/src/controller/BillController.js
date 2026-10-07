import billsModel from "../model/Bill.js";

const billController = {};

// SELECT - Todas las facturas
billController.getBills = async (req, res) => {
  try {
    const bills = await billsModel.find().populate("OrderId");
    return res.status(200).json(bills);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// SELECT - Facturas por cliente (con datos del pedido y productos)
billController.getBillsByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const bills = await billsModel
      .find({ customerId })
      .populate({
        path: "OrderId",
        populate: {
          path: "products.productId",
          select: "name nombre productName unitPrice price imageUrl image",
        },
      })
      .sort({ createdAt: -1 });
    return res.status(200).json(bills);
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// INSERT
billController.insertBills = async (req, res) => {
  try {
    const { OrderId, date, paymentMethod, customerId } = req.body;
    const newBills = new billsModel({
      OrderId,
      date,
      paymentMethod,
      customerId,
    });
    await newBills.save();
    return res.status(200).json({ message: "Bill saved" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE
billController.updateBills = async (req, res) => {
  try {
    let { OrderId, date, paymentMethod } = req.body;
    const billsUpdated = await billsModel.findByIdAndUpdate(
      req.params.id,
      {
        OrderId,
        date,
        paymentMethod,
      },
      { new: true }
    );
    if (!billsUpdated) {
      return res.status(404).json({ message: "Bills not found" });
    }
    return res.status(200).json({ message: "Bill updated" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ELIMINAR
billController.deleteBills = async (req, res) => {
  try {
    const deletedBills = await billsModel.findByIdAndDelete(req.params.id);
    if (!deletedBills) {
      return res.status(404).json({ message: "Bill not found" });
    }
    return res.status(200).json({ message: "Bill deleted" });
  } catch (error) {
    console.log("error" + error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default billController;