import express from "express";
import { authRouter } from "./routes/auth.js";
import { documentRouter } from "./routes/document.js";
import { queryRouter } from "./routes/query.js";

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/document', documentRouter);
app.use('/query', queryRouter)

app.listen(3000, () => console.log("Server has started on port 3000"));