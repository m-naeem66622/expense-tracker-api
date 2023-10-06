const bcrypt = require("bcryptjs");
const { signToken } = require("../helpers/signToken.helper");
const { generateSession } = require("../helpers/generateSession.helper");
const UserModel = require("../models/user.model");
const {
  userAccountValidator,
} = require("../helpers/userAccountValidator.helper");

const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userFound = await UserModel.getUserByUsername(username);

    if (userFound.status === "SUCCESS") {
      return res.status(409).json({
        message: "USERNMAE ALREADY EXIST",
      });
    }

    // Generating Random Session String
    const session = generateSession();
    req.body.loginSession = session;

    // Generating salt and hashing the password
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(password, salt);

    const createdUser = await UserModel.createUser(req.body);

    if (createdUser.status !== "SUCCESS") {
      return res.status(422).json({
        message: "FAILED",
        description: "User not saved",
        error: createdUser.error,
      });
    }

    // Everthing is fine, return Signed Token
    const signedToken = await signToken(createdUser.data);

    // Lets remove login session too
    createdUser.data.loginSession = undefined;

    res.status(200).json({
      message: "SUCCESS",
      data: createdUser.data,
      token: signedToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000D01", // for only development purpose while debugging
      },
    });
  }
};

const loginUser = async (req, res) => {
  const { username } = req.body;

  try {
    const projection = {
      password: 1,
      blockedStatus: 1,
      isDeleted: 1,
      isSuspended: 1,
      blockedHistory: 1,
    };
    const userFound = await UserModel.getUserByUsername(username, projection);

    // User not found in our database
    if (userFound.status !== "SUCCESS") {
      return res.status(401).json({
        message: "INVALID USER",
        description: "Wrong credentials",
      });
    }

    // Autenticate user's password, supension and blocked status
    const { statusCode, ...resObj } = await userAccountValidator(
      req.body,
      userFound.data
    );

    // If any of above validation failed
    if (resObj.message !== "SUCCESS") {
      return res.status(statusCode).json(resObj);
    }

    /* User credentials are correct. Now generate
    a session string and stored it in database */
    const sessionString = generateSession();
    userFound.data.loginSession = sessionString;
    const updatedUser = await UserModel.setSessionString(
      userFound.data._id,
      sessionString
    );

    /* If something unexpected occur while
    storing the session string */
    if (updatedUser.status !== "SUCCESS") {
      return res.status(422).json({
        message: "FAILED",
        description: "User login failed",
        error: updatedUser.error,
      });
    }

    // Everthing is fine, sign token and return
    const signedToken = await signToken(updatedUser.data);
    return res.status(200).json({
      message: "SUCCESS",
      token: signedToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000D02", // for only development purpose while debugging
      },
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Store null in place of string in sessionString
    const updatedUser = await UserModel.setSessionString(
      req.decodedToken._id,
      null
    );

    /* If something unexpected occur while
        storing the session string */
    if (updatedUser.status !== "SUCCESS") {
      return res.status(422).json({
        message: "FAILED",
        description: "User not logged out",
        error: updatedUser.error,
      });
    }

    if (updatedUser.data.loginSession === null) {
      return res.status(200).json({
        message: "SUCCESS",
      });
    } else {
      return res.status(422).json({
        message: "FAILED",
        description: "User not logged out",
        identifier: "0x000D04", // for only development purpose while debugging
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000D03", // for only development purpose while debugging
      },
    });
  }
};

const updateUser = async (req, res) => {
  const { _id: userId } = req.decodedToken;
  try {
    const filterObj = { _id: userId, isDeleted: false };
    const updateObj = req.body;
    const options = {
      new: true,
      fields: {
        password: 0,
        isSuspended: 0,
        loginSession: 0,
        blockedStatus: 0,
        isDeleted: 0,
        blockedHistory: 0,
      },
    };
    // Store null in place of string in sessionString
    const updatedUser = await UserModel.updateUserInfo(
      filterObj,
      updateObj,
      options
    );

    if (updatedUser.status === "FAILED") {
      return res.status(404).json({
        message: "FAILED",
        description: "User not found",
      });
    }

    if (updatedUser.status === "INTERNAL SERVER ERROR") {
      return res.status(422).json({
        message: "FAILED",
        description: "User not updated",
        error: updatedUser.error,
      });
    }

    res.status(200).json({
      message: "SUCCESS",
      data: updatedUser.data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000D03", // for only development purpose while debugging
      },
    });
  }
};

module.exports = { registerUser, loginUser, logoutUser, updateUser };
