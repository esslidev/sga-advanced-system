import bcrypt from "bcrypt";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const ALGORITHM = "aes-128-ecb";

export const encryptData = (data: string): string => {
  if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, "utf-8").length !== 16) {
    throw new Error("Invalid encryption key length: Expected 16 bytes.");
  }

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, "utf-8"),
    null
  );
  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// the decryptor for sensitive data

export const decryptData = (encryptedData: string): string => {
  if (!ENCRYPTION_KEY) {
    throw new Error("Internal server error | key must be defined"); // Ensure ENCRYPTION_KEY is defined
  }

  try {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, "utf-8"),
      null
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
  } catch (error) {
    throw new Error(
      "Decryption failed: possibly due to an incorrect key or corrupted data"
    ); // Handle decryption failure
  }
};

// Verification function to check if decrypted data matches original data
export const verifyEncryptedData = (
  originalData: string,
  encryptedData: string
): boolean => {
  try {
    const decryptedData = decryptData(encryptedData); // Decrypt the data
    return originalData === decryptedData; // Return true if original matches decrypted
  } catch (error) {
    return false; // If decryption fails, return false
  }
};

// Generate a salted and hashed value (e.g., password, email, etc.)
export const saltAndHashData = async (data: string): Promise<string> => {
  // Generate a salt with a complexity of 10
  const salt = await bcrypt.genSalt(10);

  // Hash the data with the generated salt
  const hashedData = await bcrypt.hash(data, salt);

  return hashedData;
};

// Verify a hashed value (e.g., password, email, etc.)
export const verifyHashedData = async (
  data: string | null,
  hashedData: string | null
): Promise<boolean> => {
  if (data == null || hashedData == null) return false;
  const match = await bcrypt.compare(data, hashedData);
  return match;
};

// Calculate JWT expiry time based on lifespan
export const getJwtExpiryTime = (
  envLifeSpanInSeconds: string | undefined
): number | undefined => {
  if (envLifeSpanInSeconds && !isNaN(Number(envLifeSpanInSeconds))) {
    return parseInt(envLifeSpanInSeconds);
  }
  return undefined;
};

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
// CIN
export const isCINValid = (cin: string): boolean => {
  const cinRegex = /^[A-Z]{1,2}\d{6,}$/i;
  return cinRegex.test(cin.trim());
};
export const isPasswordValid = (password: string): boolean => {
  // Check if password length is at least 8 characters
  if (password.length < 8) {
    return false;
  }

  // Check if password contains both letters and numbers
  const containsLetters = /[a-zA-Z]/.test(password);
  const containsNumbers = /\d/.test(password);

  return containsLetters && containsNumbers;
};

// Function to check if token is expired
export const isTokenExpired = (exp: number | undefined): boolean => {
  if (typeof exp !== "number") {
    return true; // Handle case where exp is not a number (e.g., undefined)
  }
  const currentTimestamp = Math.floor(Date.now() / 1000);
  return exp < currentTimestamp;
};

export const addSecondsToDate = (date: Date, seconds: number): Date => {
  const result = new Date(date.getTime() + seconds * 1000);
  return result;
};
// Convert a base64 string to a buffer
export const base64ToBuffer = (base64: string): Buffer => {
  return Buffer.from(base64, "base64");
};

// Convert a buffer to a base64 string
export const bufferToBase64 = (buffer: Buffer): string => {
  return buffer.toString("base64");
};
