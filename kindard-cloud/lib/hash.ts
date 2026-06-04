import crypto from "crypto";

export function generateHash(length: number = 16): string {
  return crypto.randomBytes(length).toString("hex");
}

export function generateUUID(): string {
  return crypto.randomUUID();
}
