import SalesHistory  from "../model/SalesHistory.js";

const SalesHistoryController = {}

SalesHistoryController.getHistory = async (req, res) => {
    try {
        const history = await SalesHistory.find();
        return res.status(200).json(history);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });   
    }
}

SalesHistoryController.insertSalesHistory = async (req, res) => {
    try {
        const { date, employeeId, billId, paymentMethod } = req.body;
        const newSalesHistory = new SalesHistory({
            date,
            employeeId,
            billId,
            paymentMethod
        });

        await newSalesHistory.save();
        return res.status(201).json(newSalesHistory);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

SalesHistoryController.updateSalesHistory = async (req, res) => {
    try {
        const { date, employeeId, billId, paymentMethod } = req.body;
        const updatedSalesHistory = await SalesHistory.findByIdAndUpdate(
            req.params.id,
            { date, employeeId, billId, paymentMethod },
            { new: true }
        );
        if (!updatedSalesHistory) {
            return res.status(404).json({ message: "Sales history not found" });
        }
        return res.status(200).json(updatedSalesHistory);
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

SalesHistoryController.deleteSalesHistory = async (req, res) => {
    try {
        const deletedSalesHistory = await SalesHistory.findByIdAndDelete(req.params.id);
        if (!deletedSalesHistory) {
            return res.status(404).json({ message: "Sales history not found" });
        }
        return res.status(200).json({ message: "Sales history deleted successfully" });
    } catch (error) {
        console.log("error " + error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default SalesHistoryController;