const { Transaction } = require("../schemas/transaction.schema");

const createTransaction = async (body) => {
  try {
    const transaction = await Transaction.create(body);

    if (transaction) {
      return {
        status: "SUCCESS",
        data: transaction,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C01" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C00", // for only development purpose while debugging
      },
    };
  }
};

const getTransactionById = async (filterObj, projection, options) => {
  try {
    const transaction = await Transaction.findOne(
      filterObj,
      projection,
      options
    );

    if (transaction) {
      return {
        status: "SUCCESS",
        data: transaction,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C03" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C02", // for only development purpose while debugging
      },
    };
  }
};

const getTransactionsByUserId = async (
  filterObj,
  projection,
  options,
  additional
) => {
  const { limit, page } = additional;
  try {
    const total = await Transaction.countDocuments(filterObj).exec();
    const transactions = await Transaction.find(filterObj, projection, options)
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .exec();

    if (transactions) {
      return {
        status: "SUCCESS",
        data: {
          total,
          current: transactions.length,
          limit,
          page,
          documents: transactions,
        },
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C03" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C02", // for only development purpose while debugging
      },
    };
  }
};

const updateTransaction = async (filterObj, updateObj, options) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      filterObj,
      updateObj,
      options
    );

    if (transaction) {
      return {
        status: "SUCCESS",
        data: transaction,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C03" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C02", // for only development purpose while debugging
      },
    };
  }
};

const deleteTransaction = async (filterObj, updateObj, options) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      filterObj,
      updateObj,
      options
    );

    if (transaction) {
      return {
        status: "SUCCESS",
        data: transaction,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C03" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C02", // for only development purpose while debugging
      },
    };
  }
};

module.exports = {
  createTransaction,
  getTransactionById,
  getTransactionsByUserId,
  updateTransaction,
  deleteTransaction,
};
