import { Queue } from "bullmq";

export const desfechoQueue = new Queue("desfecho", {
  connection: { host: process.env.REDIS_HOST, port: 6379 },
});
