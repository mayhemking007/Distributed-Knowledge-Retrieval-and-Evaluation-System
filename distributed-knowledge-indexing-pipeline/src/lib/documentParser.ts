import { readFile } from "fs/promises";
import path from "path";

export const documentParser = async (doc : any) => {
    const filename = doc.filename;
    const filepath = path.join(process.cwd(), 'uploads', filename);
    const content = await readFile(filepath, 'utf-8');
    if(!content) throw new Error(`File with filename - ${filename} not found`);
    return content;

}