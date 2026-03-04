import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const evalutionQueue = new Queue('eval-queue', {
    connection : redisConnection
});