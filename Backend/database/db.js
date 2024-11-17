import mongoose from "mongoose";

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"pinmust"
        })
        console.log("mongoDB connected")
    }
    catch{
        console.log(error())
    }
}

export default connectDb;