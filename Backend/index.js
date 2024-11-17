import express, { application } from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from 'cookie-parser';

dotenv.config();

const app=express();

const port=process.env.PORT;

//using middleware
app.use(express.json());
app.use(cookieParser());


// app.get("/",(req,res)=>{
//     res.send("Server working Fine")
// })

//importing routes 
import userRoutes from "./routes/userRoutes.js"

//using routes
app.use("/api/user",userRoutes); 

app.listen(port, ()=>{
    console.log(`this port is running on http://localhost:${port}`)
    connectDb();
})