import { openai } from "./openai.js"

export const generateEmbeddings = async(chunk : string) => {
    console.log("enter embedding")
    const response = await openai.embeddings.create({
        model : "text-embedding-3-small",
        input : chunk
    });
    if(!response){
        throw new Error("Openai response failed.")
    }
    
    return response.data[0]!.embedding
}