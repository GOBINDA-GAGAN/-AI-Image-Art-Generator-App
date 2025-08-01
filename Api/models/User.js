const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    credit: {
      type: Number,
      default: 3,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

// Create and export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
