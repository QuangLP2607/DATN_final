import { redis } from "../config/redis";

export async function showS3Cache(pattern = "*") {
  try {
    const keys = await redis.keys(pattern);
    console.log(`Found ${keys.length} keys matching '${pattern}'`);

    for (const key of keys) {
      const value = await redis.get(key);
      console.log(`${key} => ${value}`);
    }
  } catch (err) {
    console.error("Error reading Redis:", err);
  }
}

// showS3Cache("*");
showS3Cache("quiz*");
// showS3Cache("live*");
