import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB = async () =>{
    try {
        const c = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log("mongo connected",c.connection.host)
    } catch (error) {
        console.log("mongo connection failed !!!\n",error);   
    }
}

export default connectDB;