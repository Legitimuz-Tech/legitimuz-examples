import { Queue } from "bullmq";

export const outcomeQueue = new Queue("outcome", {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
});
