import { createClient } from "redis";

const redisClient = createClient({ url: "redis://127.0.0.1:6379" });

redisClient.on("error", (error) => {
  console.log("redis-database connection failed.");
  console.log(error);
  process.exit(1);
});

redisClient.on("connect", () => {
  console.log("redis-database connection established successfully.");
});

(async () => await redisClient.connect())();

process.on("SIGINT", async () => {
  await redisClient.QUIT();
});

export default redisClient;
