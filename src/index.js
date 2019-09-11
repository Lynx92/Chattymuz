const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const path = require("path");

const mongoose = require("mongoose");

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

mongoose
  // .connect("mongodb://localhost/chattymuz")
  .connect(
    "mongodb+srv://Lynx:admin@chattymuz-sfn9y.mongodb.net/test?retryWrites=true&w=majority"
  )
  .then(db => console.log("db is connected"))
  .catch(err => console.log(err));

app.set("port", process.env.PORT || 3000);

require("./socket")(io);

app.use(express.static(path.join(__dirname, "public")));

server.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
