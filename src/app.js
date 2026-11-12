const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const userObj = req.body;
  const user = new User(userObj);
  try {
    await user.save();
    res.send("user details saved successfully");
  } catch (err) {
    console.error("Error in saving user:" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.find({});
    if (user.length === 0) {
      res.send("user details not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("failed to get user details");
  }
});

app.get("/user", async (req, res) => {
  const emailId = req.body.emailId;
  console.log(emailId);
  try {
    const user = await User.findOne({ email: emailId });
    if (!user) {
      res.send("user details not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("failed to get user details");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("user deleted successfully");
  } catch (err) {
    res.status(400).send("failed to delete user");
  }
});

app.patch("/user", async (req, res) => {
  const emailId = req.body.email;
  const user = req.body;
  try {
    await User.findOneAndUpdate({ email: emailId }, user);
    res.send("user details updated");
  } catch (err) {
    res.status(400).send("failed to update the user details");
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
