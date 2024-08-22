import { Redis } from "ioredis";
import { _config } from "./config.js";

const redisClient = () => {
  console.log("Attempting to connect to Redis with URI:", _config.REDIS_URI);
  if (_config.REDIS_URI) {
    console.log("Redis is connected successfully!!");
    return _config.REDIS_URI
  }
  throw new Error("Redis connection failed.");
};

export const redis = new Redis(redisClient());
