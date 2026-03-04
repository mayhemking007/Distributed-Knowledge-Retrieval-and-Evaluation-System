import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import { prisma } from "../lib/prisma.js";
import { knowledgeIndexQueue } from "../lib/knowledge.queue.js";

export const documentRouter = Router();

documentRouter.use(authMiddleware)
documentRouter.use(upload.single('file'))
documentRouter.post('/uploads', async(req, res) => {
    const file = req.file;
    if(!file){
        res.status(404).json({
            success : false,
            error : "No file upload found"
        })
    }
    console.log("File uploaded successfully");
    try{
        const doc = await prisma.document.create({
            data : {
                filename : req.file?.filename as string,
                userId : req.userId as string
            }
        });
        if(doc){
            const queueSuccess = await knowledgeIndexQueue.add('doc-split', {id : doc.id});
            if(queueSuccess){
                res.json({
                    success : true,
                    status : 'queued',
                    id : doc.id
                });
            }
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error"
        })
    }
})