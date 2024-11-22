// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173"],
//   },
// });

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };


import { Server } from "socket.io";
import http from "http";
import express from "express";
import { encrypt } from "./encryption.js";
import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Store online users with their socket IDs
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Get the userId from the handshake query params and store the socketId
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  // Notify all clients of the connected users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for incoming messages
  socket.on("sendMessage", async ({ senderId, receiverId, text, image }) => {
    try {
      let imageUrl;
      if (image) {
        // Handle image upload (assuming image is base64 or URL)
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }

      // Encrypt the message text before saving
      const encryptedText = encrypt(text);

      // Create and save the new message
      const newMessage = new Message({
        senderId,
        receiverId,
        text: encryptedText, // Store the encrypted text
        image: imageUrl,
      });
      await newMessage.save();

      // Retrieve the message and decrypt it for real-time emission
      const decryptedMessage = newMessage.toObject(); // Get the decrypted message
      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", decryptedMessage); // Send decrypted message to receiver
      }

      console.log("Message sent:", decryptedMessage);
    } catch (error) {
      console.error("Error in sendMessage:", error);
    }
  });

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };

