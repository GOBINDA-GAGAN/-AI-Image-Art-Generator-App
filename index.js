
const express = require('express');
const app = express();
const connectDB = require('./Utils/db');
const authRouter= require("./Api/routes/auth")
const postRouter= require("./Api/routes/posts")
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT||5000;
connectDB();

//cd  Middleware to parse JSON
app.use(express.json());
app.use(cookieParser());

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the Express Server!');
});

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/post",postRouter)



// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

