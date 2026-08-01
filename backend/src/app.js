import express from "express"
import cookieParser from "cookie-parser";
import authRoute from "../modules/auth/auth.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser()) ;

app.use('/api/auth' , authRoute);

export default app;

