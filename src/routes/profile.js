const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const validateData = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isEditAllowed = validateData(req.body);
    if (!isEditAllowed) {
      throw new Error("failed to update the user details");
    } else {
      Object.keys(req.body).forEach(
        (key) => (loggedInUser[key] = req.body[key]),
      );
      await loggedInUser.save();
      res.send("User updated successfully");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

profileRouter.patch("/profile/forgot-password", userAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found!! please enter valid email address");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("password is not strong enough");
    }
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      throw new Error("New password should not same as old password");
    }
    const newPasswordHash = await bcrypt.hash(password, 10);
    user.password = newPasswordHash;
    await user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

module.exports = profileRouter;
