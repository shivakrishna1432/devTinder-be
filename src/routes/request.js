const express = require("express");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const { userAuth } = require("../middlewares/userAuth");
const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const receiverId = req.params.userId;
      const senderId = req.user._id;
      const status = req.params.status;
      const allowedStatus = ["interested", "ignored", "accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "invalid status type : " + status });
      }
      const receiver = await User.findById(receiverId);
      if (!receiver) {
        return res.status(404).json({ message: "receiver not found" });
      }
      const existedConnection = await ConnectionRequest.findOne({
        $or: [
          { receiverId, senderId },
          { receiverId: senderId, senderId: receiverId },
        ],
      });
      if (existedConnection) {
        throw new Error("Connection request already existed!");
      }
      const connectionRequest = new ConnectionRequest({
        receiverId,
        senderId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({ message: "connection request send successfully!", data });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
);
module.exports = connectionRequestRouter;
