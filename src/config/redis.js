import { Redis } from "ioredis";
import { _config } from "./config.js";

const redisClient = () => {
  console.log("Attempting to connect to Redis with URI:", "rediss://default:AXuHAAIncDE1MzIwM2Y5NWMwYTg0Yjk5OWYwNjRlMzRhMmQ5ZTRiNXAxMzE2MjM@sharing-mole-31623.upstash.io:6379");
  if ('rediss://default:AXuHAAIncDE1MzIwM2Y5NWMwYTg0Yjk5OWYwNjRlMzRhMmQ5ZTRiNXAxMzE2MjM@sharing-mole-31623.upstash.io:6379') {
    console.log("Redis is connected successfully!!");
    return "rediss://default:AXuHAAIncDE1MzIwM2Y5NWMwYTg0Yjk5OWYwNjRlMzRhMmQ5ZTRiNXAxMzE2MjM@sharing-mole-31623.upstash.io:6379";
  }
  throw new Error("Redis connection failed.");
};

export const redis = new Redis(redisClient());
