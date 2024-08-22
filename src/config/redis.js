import { Redis } from "ioredis";
import { _config } from "./config.js";

const redisClient = () => {
  const redisUri = _config.REDIS_URI || 'rediss://default:AXuHAAIncDE1MzIwM2Y5NWMwYTg0Yjk5OWYwNjRlMzRhMmQ5ZTRiNXAxMzE2MjM@sharing-mole-31623.upstash.io:6379';
  
  console.log("Attempting to connect to Redis with URI:", redisUri);
  
  if (redisUri) {
    const client = new Redis(redisUri);
    client.on("connect", () => {
      console.log("Redis is connected successfully!!");
    });

    client.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
    
    return client;
  } else {
    throw new Error("Redis connection failed. URI is undefined.");
  }
};

export const redis = redisClient();
