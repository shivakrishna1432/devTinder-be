const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is invalid status`,
      },
      required: true,
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({ receiverId: 1, senderId: 1 });

connectionRequestSchema.pre("save", function () {
  const connectionRequest = this;
  if (connectionRequest.receiverId.equals(connectionRequest.senderId)) {
    throw new Error("You can't send connection request to yourself!");
  }
});

const ConnectionRequest = new mongoose.model(
  "connectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
