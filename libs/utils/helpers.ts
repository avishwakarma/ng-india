import { hash, compare, genSalt } from "bcrypt";
import { v1 as uuidv1 } from "uuid";
import { randomBytes } from "crypto";
import { config } from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

/**
 * generateSalt
 *
 * @param factor number
 */
export const generateSalt = (factor: number): Promise<string> => {
  return genSalt(factor);
};

/**
 * generateRandomString
 *
 * @param size number
 * @returns string
 */
export const generateRandomString = (size: number): string => {
  return randomBytes(size).toString("hex");
};

/**
 * toHash
 *
 * @param {*} pass
 *
 * password hashing
 */
export const toHash = async (pass: string): Promise<string> => {
  return hash(pass, 10);
};

/**
 * checkHash
 *
 * @param {*} plain
 * @param {*} encrypted
 *
 * compare password hash with plain text
 */
export const checkHash = (
  plain: string,
  encrypted: string
): Promise<boolean> => {
  return compare(plain, encrypted);
};

export const uuid = () => {
  return uuidv1();
};

export const nameFromSlug = (slug: string) => {
  return slug.indexOf("-") !== -1
    ? slug
        .split("-")
        .map((s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`)
        .join(" ")
    : `${slug.charAt(0).toUpperCase()}${slug.slice(1)}`;
};

export const loadConfig = () => {
  const path: string = resolve(process.cwd(), ".env.local");

  console.log(path);

  if (existsSync(path)) {
    config({
      path,
    });
  }
};
