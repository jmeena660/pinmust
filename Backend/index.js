import express, { application } from "express";
import dotenv from "dotenv";
import connectDb from "./database/db.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api,
    api_secret: process.env.Cloud_Secret,
});  

const app = express();

const port = process.env.PORT;

//using middleware
app.use(express.json());
app.use(cookieParser());


//importing routes
import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";

//using routes
app.use("/api/user", userRoutes);
app.use("/api/pin",pinRoutes);

app.listen(port, () => {
    console.log(`this port is running on http://localhost:${port}`);
    connectDb();
});
