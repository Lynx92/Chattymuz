const Chat = require("./models/Chat");

module.exports = function(io) {
  let nicknames = [];

  io.on("connection", async socket => {
    console.log("new user connected");

    let messages = await Chat.find({}).limit(50);
    socket.emit("load old msgs", messages);

    socket.on("new user", async (data, cb) => {
      console.log(data);
      if (nicknames.indexOf(data) != -1) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        nicknames.push(socket.nickname);
        updateNicknames();
      }
    });

    socket.on("send message", async data => {
      var newMsg = new Chat({
        msg: data,
        nick: socket.nickname
      });
      await newMsg.save();

      io.sockets.emit("new message", {
        msg: data,
        nick: socket.nickname
      });
    });

    socket.on("disconnect", data => {
      if (!socket.nickname) return;
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
      updateNicknames();
    });

    function updateNicknames() {
      io.sockets.emit("usernames", nicknames);
    }
  });
};
