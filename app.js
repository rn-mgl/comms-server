require("dotenv").config();
require("express-async-errors");

const cloudinary = require("cloudinary").v2;
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const authRouter = require("./ROUTES/auth-routes");
const userRouter = require("./ROUTES/user-routes");
const directRoomRouter = require("./ROUTES/direct-room-routes");
const groupRoomRouter = require("./ROUTES/group-room-routes");
const allRoomRouter = require("./ROUTES/all-room-routes");
const directMessagesRouter = require("./ROUTES/direct-messages-routes");
const groupMessagesRouter = require("./ROUTES/group-message-routes");
const uploadRouter = require("./ROUTES/upload-router");
const directRequestRouter = require("./ROUTES/direct-request-routes");
const groupRequestRouter = require("./ROUTES/group-request-routes");
const allRequestRouter = require("./ROUTES/all-request-routes");

const authenticationMiddleware = require("./MIDDLEWARE/auth-middleware");
const notFoundMiddleware = require("./MIDDLEWARE/not-found-middleware");
const errorHandlerMiddleware = require("./MIDDLEWARE/error-middleware");

app.use(fileUpload({ useTempFiles: true }));
app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log(socket.id);

  // set global room
  let rooms = ["comms-by-rltn"];

  // join the global room on connection
  socket.join(rooms);

  socket.on("login", ({ msg }) => {
    socket.to(rooms).emit("reflect-login", msg);
  });

  socket.on("logout", ({ msg }) => {
    socket.to(rooms).emit("reflect-logout", msg);
    socket.leave(rooms);
  });

  socket.on("join-room", (room) => {
    if (!rooms.includes(room)) {
      rooms.push(room);
      socket.join(rooms);
    }
  });

  socket.on("send-message", ({ msg }) => {
    socket.to(rooms).emit("receive-message", msg);
  });
});

app.use("/auth", authRouter);
app.use("/user", authenticationMiddleware, userRouter);

app.use("/dr", authenticationMiddleware, directRoomRouter);
app.use("/gr", authenticationMiddleware, groupRoomRouter);
app.use("/ar", authenticationMiddleware, allRoomRouter);
app.use("/dm", authenticationMiddleware, directMessagesRouter);
app.use("/gm", authenticationMiddleware, groupMessagesRouter);

app.use("/uf", authenticationMiddleware, uploadRouter);

app.use("/drreq", authenticationMiddleware, directRequestRouter);
app.use("/grreq", authenticationMiddleware, groupRequestRouter);
app.use("/arreq", authenticationMiddleware, allRequestRouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const port = process.env.PORT || 9000;

const start = async () => {
  try {
    server.listen(port, () => console.log(`Listening to port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
