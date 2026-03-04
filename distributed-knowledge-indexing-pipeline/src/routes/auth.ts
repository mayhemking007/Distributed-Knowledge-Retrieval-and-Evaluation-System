import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { authMiddleware } from "../middleware/auth.js";

dotenv.config()

export const authRouter = Router();

authRouter.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.status(403).json({
            success : false,
            error : "Username or password is empty."
        })
        return;
    }
    try{
       const passwordHash = await bcrypt.hash(password, 10);
       const user = await prisma.user.create({
        data : {
            username : username,
            passwordHash : passwordHash
        }
       });
       if(user){
        res.json({
            success : true,
            data : user
        });
       }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error."
        })
    }
});

authRouter.post('/login', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(!username || !password){
        res.status(403).json({
            success : false,
            error : "Username or password is empty."
        })
        return;
    }
    try{
        const user = await prisma.user.findFirst({
            where : {username : username}
        });
        if(!user){
            res.status(404).json({
                success : false,
                error : "User not found"
            });
            return;
        }
        const decodedPassword = await bcrypt.compare(password, user.passwordHash);
        if(!decodedPassword){
            res.status(403).json({
                success : false,
                error : "Incorrect Password."
            })
            return;
        }
        const token = jwt.sign({
            userId : user.id
        }, process.env.JWT_SECRET as string);
        if(token){
            res.json({
                success : true,
                token : token
            })
        }
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error."
        });
    }
});
authRouter.use(authMiddleware);
authRouter.get('/me', async(req, res) => {
    const userId = req.userId;
    try{
        const me = await prisma.user.findFirst({
            where : {id : userId as string}
        });
        if(!me){
            res.status(404).json({
            success : false,
            error : "User not found. Login Again"
        });
        return;
        }
        res.json({
            success : true,
            data : me
        });
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            error : "Internal Server Error."
        });
    }
});