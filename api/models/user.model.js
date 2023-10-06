const mongoose = require("mongoose");
const { User } = require("../schemas/user.schema");

const createUser = async (body) => {
  try {
    const user = await User.create(body);

    /* Exclude these fields from the Object.
    There is no sense to send it in response 
    And assigning undefined because delete
    operator not work on mongooose document */
    user.password = undefined;
    user.isSuspended = undefined;
    user.isDeleted = undefined;
    user.blockedStatus = undefined;
    user.blockedHistory = undefined;

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
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

const getUserById = async (userId, projection) => {
  try {
    const user = await User.findById(userId, projection);

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
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

const getUserByUsername = async (username, projection) => {
  try {
    const user = await User.findOne({ username }, projection);

    if (user) {
      return {
        status: "SUCCESS",
        data: user,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C05" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C04", // for only development purpose while debugging
      },
    };
  }
};

const setSessionString = async (userId, loginSession = null) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { loginSession },
      { new: true }
    );

    if (updatedUser) {
      return {
        status: "SUCCESS",
        data: updatedUser,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C07" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C06", // for only development purpose while debugging
      },
    };
  }
};

const updateUserInfo = async (filterObj, updateObj, options) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      filterObj,
      { $set: updateObj },
      options
    );

    if (updatedUser) {
      return {
        status: "SUCCESS",
        data: updatedUser,
      };
    } else {
      return {
        status: "FAILED",
        error: { identifier: "0x000C14" }, // for only development purpose while debugging
      };
    }
  } catch (error) {
    return {
      status: "INTERNAL SERVER ERROR",
      error: {
        message: error.message,
        identifier: "0x000C13", // for only development purpose while debugging
      },
    };
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  setSessionString,
  updateUserInfo
};
