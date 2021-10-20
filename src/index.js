const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);

const io = require("socket.io")(server, {
  cors: {
    origin: "https://hopeful-payne-6498d9.netlify.app",
    methodhs: ["GET", "POST"],
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

  socket.on(
    "answerCall",
    (data) => io.to(data.to).emit("callAccept"),
    data.signal
  );
});

// io.on("connection", (socket) => {
//   console.log(socket.id);
// });

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
