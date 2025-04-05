const express = require("express");
const socket = require("socket.io");
const cors = require("cors");

const app = express();

const server = app.listen(4000, () => {
  console.log("listening on port 4000");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", () => {
  console.log("socket connection created");
});
