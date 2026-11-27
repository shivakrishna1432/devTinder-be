const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);

connectDB()
  .then(() => {
    console.log("database is established!!!");
    app.listen(7777, () => {
      console.log("server is running at port 7777!!!");
    });
  })
  .catch((err) => {
    console.error("database is not established!!!");
  });
