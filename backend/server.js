const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  console.log("test works");
});

app.listen(4000, () => {
  console.log("listening on port 4000");
});
