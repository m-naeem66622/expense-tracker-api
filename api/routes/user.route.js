const express = require("express");
/* ------------------------ Importing Middlewares ------------------------ */
const {
  registerUser,
  loginUser,
  logoutUser,
  updateUser,
} = require("../controllers/user.controller");
const {
  validateRequest,
} = require("../middlewares/validateRequest.middleware");
const {
  userRegisterSchema,
  userLoginSchema,
  updateUserProfileSchema,
} = require("../validators/user.validator");
const { authentication } = require("../middlewares/authentication.middleware");
/* ------------------------ Importing Middlewares ------------------------ */

const userRouter = express.Router();

userRouter.post(
  "/register",
  validateRequest(userRegisterSchema, "BODY"),
  registerUser
);

userRouter.post("/login", validateRequest(userLoginSchema, "BODY"), loginUser);

userRouter.get("/logout", authentication, logoutUser);

userRouter.patch(
  "/update",
  validateRequest(updateUserProfileSchema, "BODY"),
  authentication,
  updateUser
);

module.exports = userRouter;
