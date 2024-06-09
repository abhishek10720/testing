import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit:"16kb"}))
app.use(express.static('public'))
// app.use(cookieParser());
//import user routes
import userRouter from "./routes/user.routes.js"
//user routes declaration
// app.use('/users', userRouter) but for best practices
app.use('/api/v1/users', userRouter)    //api with versioning           



export {app}