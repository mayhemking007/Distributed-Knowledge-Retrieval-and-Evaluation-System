import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export const knowledgeIndexQueue = new Queue('knowledgeIndex', {
    connection : redisConnection
});