import mongoose from "mongoose";
const connectToDB=async()=>{
    try{
         const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log("connected the database");
    }catch(err){
        console.log("error:"+err);
    }
}
export default connectToDB;