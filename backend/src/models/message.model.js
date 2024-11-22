// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     text: {
//       type: String,
//     },
//     image: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// const Message = mongoose.model("Message", messageSchema);

// export default Message;

import mongoose from "mongoose";
import { decrypt, encrypt } from "../lib/encryption.js";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      set: encrypt, // Encrypt before saving to DB
      get: decrypt, // Decrypt when retrieving from DB
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
