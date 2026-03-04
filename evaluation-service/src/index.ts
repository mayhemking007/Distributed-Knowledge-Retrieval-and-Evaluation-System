import express from "express";
import dotenv from "dotenv";
import { evaluationRouter } from "./routes/evaluation.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use('/evaluation', evaluationRouter);



app.listen(4000, () => {console.log("Server running on port 4000")})