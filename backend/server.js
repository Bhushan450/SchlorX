import "dotenv/config";
import connectDb from "./common/config/db.js"
import app from "./src/app.js"

const PORT = process.env.PORT || 4000;

const start = async ()=>{

    // connect with DB 
    await connectDb();
    try {
        
        app.listen(PORT, ()=>{
            console.log(`Server is listning on port :${PORT} and in ${process.env.NODE_ENV}`);
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

