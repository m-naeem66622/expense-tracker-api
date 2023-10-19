const mongoose = require("mongoose");
const TransactionModel = require("../models/transaction.model");

const createTransaction = async (req, res) => {
  const userId = req.decodedToken._id;

  try {
    req.body.user = userId;

    const createdTransaction = await TransactionModel.createTransaction(
      req.body
    );

    if (createdTransaction.status !== "SUCCESS") {
      return res.status(422).json({
        message: "FAILED",
        description: "Transaction not saved",
        error: createdTransaction.error,
      });
    }

    res.json({
      message: "SUCCESS",
      data: createdTransaction.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000B00", // for only development purpose while debugging
      },
    });
  }
};

const getTransactionById = async (req, res) => {
  const { _id: userId } = req.decodedToken;
  const { transactionId } = req.params;

  try {
    const filterObj = { _id: transactionId, user: userId, isDeleted: false };

    const transactionFound = await TransactionModel.getTransactionById(
      filterObj
    );

    if (transactionFound.status === "FAILED") {
      return res.status(404).json({
        message: "FAILED",
        description: "Transaction not found",
      });
    }

    if (transactionFound.status === "INTERNAL SERVER ERROR") {
      return res.status(422).json({
        message: "FAILED",
        description: "Transaction not deleted",
        error: transactionFound.error,
      });
    }

    res.json({ message: "SUCCESS", data: transactionFound.data });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000B01", // for only development purpose while debugging
      },
    });
  }
};

const getTransactionsByUserId = async (req, res) => {
  const { _id: userId } = req.decodedToken;
  const { from, to } = req.query;

  try {
    const filterObj = {
      // user: new mongoose.Types.ObjectId(userId),
      user: new mongoose.Types.ObjectId(userId),
      isDeleted: false,
    };

    if (from) {
      filterObj.updatedAt = {};
      filterObj.updatedAt.$gte = new Date(from).toISOString();
    }
    if (to) {
      !filterObj.updatedAt ? (filterObj.updatedAt = {}) : null;
      filterObj.updatedAt.$lte = new Date(to).toISOString();
    }

    const additionalObj = {
      limit: parseInt(req.query.limit),
      page: parseInt(req.query.page),
    };

    const transactionFound = await TransactionModel.getTransactionsByUserId(
      filterObj,
      additionalObj
    );

    if (transactionFound.status === "FAILED") {
      return res.status(404).json({
        message: "FAILED",
        description: "Transaction not found",
      });
    }

    if (transactionFound.status === "INTERNAL SERVER ERROR") {
      return res.status(422).json({
        message: "FAILED",
        description: "Transaction not fetched",
        error: transactionFound.error,
      });
    }

    res.json({ message: "SUCCESS", data: transactionFound.data });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000B02", // for only development purpose while debugging
        trace: error.stack,
      },
    });
  }
};

const updateTransaction = async (req, res) => {
  const { _id: userId } = req.decodedToken;
  const { transactionId } = req.params;

  try {
    const filterObj = { _id: transactionId, user: userId, isDeleted: false };
    const updateObj = req.body;
    const options = { new: true };

    const updatedTransaction = await TransactionModel.updateTransaction(
      filterObj,
      updateObj,
      options
    );

    if (updatedTransaction.status === "FAILED") {
      return res.status(404).json({
        message: "FAILED",
        description: "Transaction not found",
      });
    }

    if (updatedTransaction.status === "INTERNAL SERVER ERROR") {
      return res.status(422).json({
        message: "FAILED",
        description: "Transaction not updated",
        error: updatedTransaction.error,
      });
    }

    res.json({
      message: "SUCCESS",
      data: updatedTransaction.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000B03", // for only development purpose while debugging
      },
    });
  }
};

const deleteTransaction = async (req, res) => {
  const { _id: userId } = req.decodedToken;
  const { transactionId } = req.params;

  try {
    const filterObj = { _id: transactionId, user: userId, isDeleted: false };
    const updateObj = { isDeleted: true };

    const updatedTransaction = await TransactionModel.updateTransaction(
      filterObj,
      updateObj
    );

    if (updatedTransaction.status === "FAILED") {
      return res.status(404).json({
        message: "FAILED",
        description: "Transaction not found",
      });
    }

    if (updatedTransaction.status === "INTERNAL SERVER ERROR") {
      return res.status(422).json({
        message: "FAILED",
        description: "Transaction not deleted",
        error: updatedTransaction.error,
      });
    }

    res.json({ message: "SUCCESS" });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000B04", // for only development purpose while debugging
      },
    });
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionsByUserId,
  updateTransaction,
  deleteTransaction,
};
