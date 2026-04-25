import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

//routers import
import userRouter from "./routes/user.routes.js";

//routers
app.use("/api/v1/users", userRouter);

http://localhost:5000/api/v1/users/register

export default app;