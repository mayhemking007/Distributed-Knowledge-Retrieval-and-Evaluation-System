import { generateEmbeddings } from "../ai/generateEmbeddings.js";
import { prisma } from "../lib/prisma.js";

export const chunkProcessingHandler = async(job : any) => {
    const chunkId = job.id;
    try{
        const chunk = await prisma.chunk.findFirst({
            where : {id : chunkId}
        });
        if(!chunk){
            throw new Error("Chunk not found in DB");
        }
        const embedding = await generateEmbeddings(chunk.content);
        const vectorString = `[${embedding.join(',')}]`;
        await prisma.$transaction(async(tsx) => {
            await tsx.$executeRawUnsafe(`UPDATE "Chunk"
            SET embedding = '${vectorString}'::vector
            WHERE id = '${chunkId}'`);
            await tsx.chunk.update({
                where : {id : chunkId},
                data : {
                    status : 'COMPLETE'
                }
            });
            await tsx.document.update({
                where : {id : chunk.documentId},
                data : {
                    status : 'EMBEDDING',
                    processedChunks : {increment : 1}
                }
            });
        });
        console.log("Saved");

    }
    catch(e){
        console.log(e);
        throw e;
    }
}