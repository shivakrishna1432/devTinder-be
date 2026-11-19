const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { now } = require("mongoose");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.send("user details saved successfully");
  } catch (err) {
    res.status(400).send("Error in saving user:" + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("invalid email or password");
    }
    const isPasswordMatched = await user.compareUserPassword(password);
    if (isPasswordMatched) {
      const token = await user.getJwt();
      res.cookie("token", token);
      res.send("login Successful!!!");
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Logout successful!!");
});

module.exports = authRouter;
