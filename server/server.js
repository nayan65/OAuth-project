import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import "dotenv/config"
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app=express();
const port=process.env.PORT || 3000;
connectDB();

const allowedOrigin=['http://localhost:5173']
app.use(express.json())
app.use(cookieParser())
app.use(cors({origin:allowedOrigin, credentials:true}))


app.use("/",authRouter);
app.use("/user",userRouter);



app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
    
})