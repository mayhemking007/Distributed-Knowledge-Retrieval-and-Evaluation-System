import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.js";
import { documentRouter } from "./routes/document.js";
import { queryRouter } from "./routes/query.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/document', documentRouter);
app.use('/query', queryRouter)

app.listen(process.env.SERVER_PORT, () => console.log(`Server has started on port ${process.env.SERVER_PORT}`));