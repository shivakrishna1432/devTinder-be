const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/userAuth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.get("/feed", userAuth, async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.send("user details not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("failed to get user details" + err.message);
  }
});

app.get("/user", userAuth, async (req, res) => {
  const emailId = req.body.emailId;
  try {
    const user = await User.findOne({ email: emailId });
    if (!user) {
      res.send("user details not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("failed to get user details" + err.message);
  }
});

app.delete("/user", userAuth, async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("failed to delete user" + err.message);
  }
});

app.patch("/user", userAuth, async (req, res) => {
  const emailId = req.body.email;
  const user = req.body;
  try {
    await User.findOneAndUpdate({ email: emailId }, user, {
      runValidators: true,
    });
    res.send("user details updated");
  } catch (err) {
    res.status(400).send("failed to update the user details" + err.message);
  }
});

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
