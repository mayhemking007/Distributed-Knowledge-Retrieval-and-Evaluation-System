import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { evalutionQueue } from "../lib/evaluationQueue.js";

export const evaluationRouter = Router();

evaluationRouter.post('/', async(req, res) => {
    const {model, query, answer, context} = req.body;
    try{
        const evaluation = await prisma.evaluation.create({
            data : {
                model : model,
                query : query,
                answer : answer,
                context : context,
            }
        });
        const evalQueue = await evalutionQueue.add('eval-job', {id : evaluation.id});
        if(evalQueue) console.log("Job added to the queue");
        res.json({
            success : true,
            status : "queued",
            evaluationId : evaluation.id
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error"
        })
    }
});

evaluationRouter.get('/', async(req, res) => {
    const {evaluationId} = req.body;
    try{
        const evaluationResult = await prisma.evaluationResult.findFirst({
            where : {evaluationId : evaluationId}
        });
        if(!evaluationId){
            res.status(403).json({
                success : false,
                error : `The result is not found for the evaluation id - ${evaluationId}`
            });
            return;
        }
        res.json({
            success : true,
            data : evaluationResult
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error"
        })
    }
})