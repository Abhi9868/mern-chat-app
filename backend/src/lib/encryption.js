import crypto from "crypto";

const ENCRYPTION_KEY = "b8e9271a8b4e8e0b9b9c76126c8c3c74fbbd2562ee245d3478db0c937b17e1c3"

// AES-256 CBC Encryption and Decryption
const algorithm = "aes-256-cbc";
const secretKey = Buffer.from(ENCRYPTION_KEY, "hex"); // Use a 256-bit hex key
const ivLength = 16; // IV length for AES-256 CBC

// Encrypt the message text
export const encrypt = (text) => {
    const iv = crypto.randomBytes(ivLength); // Random IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return `${iv.toString("hex")}:${encrypted}`; // Return IV + encrypted text
};

// Decrypt the message text
export const decrypt = (encryptedText) => {
    const [iv, encrypted] = encryptedText.split(":"); // Split IV and encrypted text
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, "hex"));
    let decrypted = decipher.update(encrypted, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};
