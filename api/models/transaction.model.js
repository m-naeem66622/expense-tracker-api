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
        error: { identifier: "0x000A01" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000A00", // for only development purpose while debugging
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
        error: { identifier: "0x000A03" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000A02", // for only development purpose while debugging
      },
    };
  }
};

const getTransactionsByUserId = async (filterObj, additional) => {
  const { limit, page } = additional;
  try {
    const total = await Transaction.countDocuments(filterObj).exec();

    const pipeline = [
      {
        $match: {
          ...filterObj,
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalIncome: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$type", "INCOME"],
                      },
                      "$amount",
                      0,
                    ],
                  },
                },
                totalExpense: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$type", "EXPENSE"],
                      },
                      "$amount",
                      0,
                    ],
                  },
                },
              },
            },
            {
              $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                balance: {
                  $add: ["$totalIncome", "$totalExpense"],
                },
              },
            },
          ],
          transactions: [
            {
              $skip: (additional.page - 1) * additional.limit,
            },
            {
              $limit: additional.limit,
            },
          ],
        },
      },
      {
        $unwind: "$summary",
      },
    ];

    const dataFound = await Transaction.aggregate(pipeline).exec();

    if (dataFound[0]?.transactions.length) {
      return {
        status: "SUCCESS",
        data: {
          pagination: {
            total,
            current: dataFound[0].transactions?.length,
            limit,
            page,
          },
          ...dataFound[0],
        },
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000A05" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000A04", // for only development purpose while debugging
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
        error: { identifier: "0x000A07" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000A06", // for only development purpose while debugging
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
        error: { identifier: "0x000A09" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000A08", // for only development purpose while debugging
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
