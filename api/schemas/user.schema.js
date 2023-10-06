const mongoose = require("mongoose");

const blockedStatus = new mongoose.Schema(
  {
    isBlocked: { type: Boolean, default: false },
    blockedAt: { type: Date, default: null },
    blockedCount: { type: Number, default: 0 },
    blockedFor: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, uppercase: true, trim: true },
    lastName: { type: String, required: true, uppercase: true, trim: true },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    password: { type: String, required: true, minLength: 8 },
    isSuspended: { type: Boolean, default: false },
    blockedHistory: [blockedStatus],
    loginSession: { type: String, default: null },
    blockedStatus: {
      type: blockedStatus,
      default: {
        isBlocked: false,
        blockedAt: null,
        blockedCount: 0,
        blockedFor: 0,
      },
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
