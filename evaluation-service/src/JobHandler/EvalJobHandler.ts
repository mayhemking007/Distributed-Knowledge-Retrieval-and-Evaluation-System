import { openai } from "../lib/openai.js";
import { prisma } from "../lib/prisma.js";

export const evalJobHandler = async(data : any) => {
    const evalId = data.id;
    try{
        const evaluation = await prisma.evaluation.findFirst({
            where : {id : evalId}
        });
        if(!evaluation){
            throw new Error("Evaluation not found")
        }
        const response = await openai.chat.completions.create({
            model : "gpt-4o-mini",
            messages : [{
                role : "system",
                content : "You are a LLM answer evaluator. You'll be given model, question, answer and context. You need to evaluate the groundedness score which will be an integer in the range 0 to 5 where 5 being fully supported by context, give a boolean hellucination flag where true → Answer contains unsupported info and false → Fully grounded, you will provide 3-4 line reasoning for the above the metrics. Return the json in the format : { groundedness_score : 4, hallucination_flag : false, reasoning : 'The answer contains topic out of context.' }"
            },
            {
                role : "user",
                content : `Question: 
                ${evaluation?.query}
                
                Answer: 
                ${evaluation?.answer}
                
                Model: 
                ${evaluation?.model}
                
                Context: 
                ${evaluation?.context}`
            }
        ],
        temperature: 0.2
        });
        const result = response.choices[0]?.message.content;
        const res = JSON.parse(result as string);
        if(!result){
            throw new Error("The LLM is not responding");
        }
        await prisma.$transaction(async (tsx) => {
            await tsx.evaluationResult.create({
                data : {
                    evaluationId : evaluation!.id as string,
                    groundednessScore : res.groundedness_score,
                    hallucinationFlag : res.hallucination_flag,
                    reasoning : res.reasoning
                }
            });
            await tsx.evaluation.update({
                where : {id : evaluation.id},
                data : {status : "COMPLETED"}
            });
        });
        const evRes = await prisma.evaluationResult.findFirst({
            where : {evaluationId : evalId}
        });
        console.log(evRes);

    }
    catch(e){
        await prisma.evaluation.update({
            where : {id : evalId},
            data : {status : "FAILED"}
        });
        console.log(e);
        throw e;
    }
}