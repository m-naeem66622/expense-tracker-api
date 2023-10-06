const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config(); // configure before importing connectToDatabase;

const { connectToDatabase } = require("./dependencies/db");

connectToDatabase();

const app = express();
const PORT = process.env.PORT || "5000";

app.use(cors());
app.use(express.json());

// Available endpoints
const audioBookRouter = require("./api/routes/transaction.route");
app.use("/api/transaction", audioBookRouter);

const userRouter = require("./api/routes/user.route");
app.use("/api/user", userRouter);

app.use("/", (req, res) => {
  return res.status(404).json({
    message: "No such route found",
  });
});

app.listen(PORT, () => {
  console.log("server is running");
});
