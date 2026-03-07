import dotenv from "dotenv";

dotenv.config();

export const redisConnection = {
    port : process.env.REDIS_PORT as any,
    host : process.env.HOST as string
}