const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Express test server is working!");
});

const server = app.listen(5001, () => {
  console.log("EXPRESS TEST SERVER RUNNING");
});

console.log("Server address:", server.address());
