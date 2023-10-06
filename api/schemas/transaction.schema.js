const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, default: "" },
    amount: { type: Number, required: true },
    type: {
      type: String, // You can use 'expense' or 'income' to differentiate.
      enum: ["EXPENSE", "INCOME"],
      uppercase: true,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = { Transaction };
