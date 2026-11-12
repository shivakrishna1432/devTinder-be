const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://aryannn1432_db_user:mOUalntydXTSmb1Q@namaste-node.cyxuxjw.mongodb.net/devTinder",
  );
};
module.exports = connectDB;
