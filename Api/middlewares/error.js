const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  if (err instanceof CustomError) {
    return res.status(error.status).json({
      error: error.message,
    });
  } else {
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

class CustomError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, CustomError };
