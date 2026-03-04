import { Worker } from "bullmq";
import { evalJobHandler } from "./JobHandler/EvalJobHandler.js";
import { redisConnection } from "./lib/connection.js";

new Worker('eval-queue', async(job) => {
    console.log("Worker has started");
    if(job.name == "eval-job"){
        return evalJobHandler(job.data)
    }
},{connection : redisConnection, concurrency : 2})