const jwt = require("jsonwebtoken");
const { CustomError } = require("./error");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new CustomError("You are not authenticated!", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    next(new CustomError("Token is not valid", 403));
  }
};

module.exports = verifyToken;
