const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  reFetchController,
} = require("../controllers/authController");
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.get("/user",verifyToken, reFetchController);

module.exports = router;
