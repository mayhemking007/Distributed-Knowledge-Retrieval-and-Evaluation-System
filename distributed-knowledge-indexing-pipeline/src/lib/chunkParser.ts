export const chunkParser = (content : string, chunkSize : number, overlap : number) => {
    const words = content.split(/\s+/);
    console.log(words.length);
    const chunks = [];
    for(let i = 0; i < words.length; i += chunkSize - overlap){
        const chunk = words.slice(i, i + chunkSize).join(" ");
        chunks.push(chunk);
    }
    return chunks
}