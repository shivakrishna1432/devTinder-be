const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Hello user!!!");
});

app.listen(7777, () => {
  console.log("server is started at port 7777!!!");
});
