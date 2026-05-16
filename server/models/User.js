const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: null,
    },

    googleId: {
      type: String,
      default: null,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    displayName: { type: String, default: null },
    profilePicture: { type: String, default: null },
    dateOfBirth: { type: Date, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", UserSchema);