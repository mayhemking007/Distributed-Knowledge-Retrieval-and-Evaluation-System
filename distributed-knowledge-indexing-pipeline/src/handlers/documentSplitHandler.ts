import { chunkParser } from "../lib/chunkParser.js";
import { documentParser } from "../lib/documentParser.js";
import { knowledgeIndexQueue } from "../lib/knowledge.queue.js";
import { prisma } from "../lib/prisma.js";

export const DocumentSplitHandler = async (job : any) => {
    const docId = job.id;
    try{
        const doc = await prisma.document.findFirst({
            where : {id : docId}
        });
        if(!doc) throw new Error(`Cannot find document with id ${docId}`);
        console.log(doc.status)
        const content = await documentParser(doc);
        const chunks = chunkParser(content, 100, 20);
        const chunksData = chunks.map((chunk) => ({
            content : chunk,
            documentId : doc.id,
        }));
        await prisma.$transaction(async (tsx) => {
            await tsx.chunk.createMany({
                data : chunksData
            });
            await tsx.document.update({
                where : {id : doc.id},
                data : {
                    status : 'SPLIT',
                    totalChunks : chunksData.length
                }
            });
        });
        const chunksDB = await prisma.chunk.findMany({
            where : {documentId : doc.id},
            select : {id : true}
        });
        const chunkQueue = await knowledgeIndexQueue.addBulk(chunksDB.map((c : any) => ({ 
            name : 'chunk-processing',
            data : {id : c.id}
        })));
        if(chunkQueue){
            console.log("chunks enqueued")
        }


    }
    catch(e){
        console.log(e);
        throw e;
    }
} 