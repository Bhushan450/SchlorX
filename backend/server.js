import connectDb from "./common/config/db.js"
import app from "./src/app.js"
import dotenv from "dotenv"
dotenv.config();

const PORT = process.env.PORT || 4040;

const start = async ()=>{

    // connect with DB 
    await connectDb();
    try {
        
        app.listen(PORT, ()=>{
            console.log(`Server is listning on port :${PORT} and in ${process.env.DEV_MODE}`);
        })
    } catch (error) {
        console.log("Failed to start server", error);
        process.exit(1);
    }
}

start().catch((error)=>{
    console.log("Failed to start Server");
    process.exit(1);
})

