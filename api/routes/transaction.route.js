const express = require("express");
/* ------------------------ Importing Middlewares ------------------------ */
const {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionById,
  getTransactionsByUserId,
} = require("../controllers/transaction.controller");
const {
  validateRequest,
} = require("../middlewares/validateRequest.middleware");
const {
  transactionSchema,
  updateTransactionSchema,
} = require("../validators/transaction.validator");
const { authentication } = require("../middlewares/authentication.middleware");
/* ------------------------ Importing Middlewares ------------------------ */

const transactionRouter = express.Router();

/* ------------------------ Transaction Basic CRUD Routes ------------------------ */
transactionRouter.get(
  "/:transactionId",
  authentication,
  validateRequest(transactionSchema.PARAMS, "PARAMS"),
  getTransactionById
);
transactionRouter.get(
  "/",
  authentication,
  validateRequest(transactionSchema.QUERY, "QUERY"),
  getTransactionsByUserId
);
transactionRouter.post(
  "/",
  authentication,
  validateRequest(transactionSchema.BODY, "BODY"),
  createTransaction
);
transactionRouter.put(
  "/:transactionId",
  authentication,
  validateRequest(transactionSchema.PARAMS, "PARAMS"),
  validateRequest(updateTransactionSchema, "BODY"),
  updateTransaction
);
transactionRouter.delete(
  "/:transactionId",
  authentication,
  validateRequest(transactionSchema.PARAMS, "PARAMS"),
  deleteTransaction
);
/* ------------------------ Transaction Basic CRUD Routes ------------------------ */

module.exports = transactionRouter;
