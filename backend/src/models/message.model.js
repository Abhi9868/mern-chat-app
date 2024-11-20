import mongoose from "mongoose";
import crypto from "crypto";

// Define a secret key and an initialization vector (IV)
// You should store the secret securely (e.g., in environment variables)
const SECRET_KEY = crypto.randomBytes(32).toString("hex") || "your-secret-key"; // Must be 32 bytes for AES-256
const IV = crypto.randomBytes(16).toString("hex") || crypto.randomBytes(16); // Must be 16 bytes

// Helper functions for encryption and decryption
const encrypt = (text) => {
  if (!text) return text;
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${IV.toString("hex")}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  if (!encryptedText) return encryptedText;
  const [iv, content] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), Buffer.from(iv, "hex"));
  let decrypted = decipher.update(content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// Define the schema
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
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

// Middleware to encrypt the message text before saving
messageSchema.pre("save", function (next) {
  if (this.text) {
    this.text = encrypt(this.text);
  }
  next();
});

// Middleware to decrypt the message text after retrieving
messageSchema.post("init", function (doc) {
  if (doc.text) {
    doc.text = decrypt(doc.text);
  }
});

// Alternatively, a custom method for decryption
messageSchema.methods.getDecryptedText = function () {
  return decrypt(this.text);
};

// Create the model
const Message = mongoose.model("Message", messageSchema);

export default Message;
