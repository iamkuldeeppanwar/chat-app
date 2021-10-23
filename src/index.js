const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const users = [{}];

const io = require("socket.io")(server, {
  cors: {
    origin: "https://nervous-tesla-1ff2b8.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { name: users[id], message, id });
  });
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
