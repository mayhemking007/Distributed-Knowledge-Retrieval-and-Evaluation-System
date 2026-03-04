import { Worker } from "bullmq";
import { DocumentSplitHandler } from "./handlers/documentSplitHandler.js";
import { redisConnection } from "./lib/connection.js";
import { chunkProcessingHandler } from "./handlers/chunkProcessingHandler.js";

new Worker('knowledgeIndex', async(job) => {
    console.log("Worker has started");
    switch (job.name){
        case 'doc-split':
            return DocumentSplitHandler(job.data);
        case 'chunk-processing' : 
        return chunkProcessingHandler(job.data)
    }
},{
    connection : redisConnection,
    concurrency : 2
})