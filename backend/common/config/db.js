import mongoose from "mongoose";

const connectDb = async ()=>{

    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`mongoDb connected!: ${connect.connection.host}`);
        
    } catch (error) {
        console.log("Failed to connect mongoDB:", error);
        
    }
}

export default connectDb;