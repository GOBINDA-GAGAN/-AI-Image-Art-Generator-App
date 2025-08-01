const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const { CustomError } = require("../middlewares/error");

const registerController = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      throw new CustomError("Username of email already exist", 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const saveUser = await newUser.save();

    res.status(201).json({
      saveUser,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      throw new CustomError("All fields are required", 400);
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new CustomError("User does not exist", 404);
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid email or password", 401);
    }

    // Payload for JWT
    const payload = { id: existingUser._id };

    // Get secrets
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRE = process.env.JWT_EXPIRE;

    if (!JWT_SECRET || !JWT_EXPIRE) {
      throw new CustomError("JWT configuration missing", 500);
    }

    // Create token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    // Set cookie securely
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(JWT_EXPIRE) * 1000, // assuming JWT_EXPIRE is in seconds
    });

    // Send response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: existingUser._id,
        email: existingUser.email,
        token, // optional to send in body
      },
    });
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

const reFetchController = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      message: "User is authenticated",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerController,
  loginController,
  reFetchController,
  logoutController,
};
