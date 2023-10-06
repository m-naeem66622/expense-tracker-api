const Joi = require("joi");

const transactionSchema = {
  QUERY: Joi.object({
    limit: Joi.number().min(0).max(10).required(),
    page: Joi.number().min(0).required(),
  }),

  PARAMS: Joi.object({
    transactionId: Joi.string().hex().length(24).required(),
  }),

  BODY: Joi.object({
    description: Joi.string().required(),
    amount: Joi.number().required(),
    type: Joi.string()
      .uppercase()
      .required()
      .when("amount", {
        is: Joi.number().less(0),
        then: Joi.valid("EXPENSE"),
        otherwise: Joi.valid("INCOME"),
      }),
  }),
};

const updateTransactionSchema = Joi.object({
  description: Joi.string(),
  amount: Joi.number(),
  type: Joi.string()
    .uppercase()
    .when("amount", {
      is: Joi.number().less(0),
      then: Joi.valid("EXPENSE"),
      otherwise: Joi.valid("INCOME"),
    }),
});

module.exports = {
  updateTransactionSchema,
  transactionSchema,
};
