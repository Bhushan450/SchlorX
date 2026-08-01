import mongoose from "mongoose";
import express from "express"

const connectDb = async ()=>{

    try {
        const connect = await mongoose.connect('mongodb://127.0.0.1:27017/test');

        console.log(`mongoDb connected!: ${connect.connection.host}`);
        
    } catch (error) {
        console.log("Failed to connect mongoDB:", error);
        
    }
}

export default connectDb;