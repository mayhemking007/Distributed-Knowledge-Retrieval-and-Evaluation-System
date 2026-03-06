import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { generateEmbeddings } from "../ai/generateEmbeddings.js";
import { openai } from "../ai/openai.js";
import { authMiddleware } from "../middleware/auth.js";
import axios from "axios";

export const queryRouter = Router();
queryRouter.use(authMiddleware);
queryRouter.post('/', async (req, res) => {
    const {query, documentId} = req.body;
    const userId = req.userId;
    const model = "gpt-4o-mini";
    try{
        const doc = await prisma.document.findFirst({
            where : {id : documentId}
        });
        if(!doc){
            res.status(403).json({
                success : false,
                error : "Document not found"
            });
            return;
        }
        // if(doc!.status != 'COMPLETE'){
        //     res.status(400).json({
        //         success : false,
        //         error : "Document is not processed"
        //     });
        //     return;
        // }
        const queryEmbeddings = await generateEmbeddings(query as string);
        if(queryEmbeddings) console.log("Query embeddings generated");
        const queryVectorString = `[${queryEmbeddings.join(',')}]`;
        const topChunks : any = await prisma.$queryRawUnsafe(`SELECT id, content from "Chunk" 
            WHERE "documentId" = '${documentId}'
            ORDER BY embedding <=> '${queryVectorString}'::vector 
            LIMIT 5`
        );
        const context = topChunks ? topChunks.map((chunk : any, index : number) => (
            `Context ${index}: \n${chunk.content}`
        )).join('\n\n') : [];
        
        const completion = await openai.chat.completions.create({
            model : model,
            messages : [
                {
                    role : 'system',
                    content : 'You are a helpful assitant. Answer only from the context. If answer not found in the context then answer - Not Found in the document.'
                },
                {
                    role : 'user',
                    content : `Context: 
                    ${context}
                    
                    question:
                    ${query}`
                }
            ],
            temperature : 0.2
        });
        const result = completion.choices[0]?.message.content;
        if(result){
            const queryResult = await prisma.query.create({
                data : {
                    question : query,
                    answer : result,
                    userId : userId as string,
                    documentId : doc.id as string
                }
            });
            const evaluation = await axios.post('http://localhost:4000/evaluation', {
                model : model,
                query : queryResult.question,
                answer : queryResult.answer,
                context : context 
            });
            if(!evaluation){
                throw new Error("Cannot fetch Evaluation");
            }
            const evaluationResult = await waitForGetData(evaluation.data.evaluationId);
            console.log(evaluationResult.data);
            res.json({
                success : true,
                answer : result,
                evaluations : evaluationResult.data
            });
        }

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error"
        })
    }
});

const waitForGetData = async(evaluationId : string) => {
    const mxAttempts = 100, delay = 500;
    for(let i = 0; i < mxAttempts; i++){
        console.log(`polling - ${i}`);
        const res = await axios.get(`http://localhost:4000/evaluation/${evaluationId}`);
        if(res.data.data && res.data.success === true){
            return res.data;
        }
        await new Promise((r) => setTimeout(r, delay));
    }
    return null;
}