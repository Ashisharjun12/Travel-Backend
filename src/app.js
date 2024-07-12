import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/ErrorHandler.js";
import userRoute from "./routes/userRoute.js";

const app = express()



//important middlewares
app.use(
    cors({
      origin: "*",
    })
  );

//set up middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


//check server
app.get("/", (req, res) => {
    res.json({message:"server is successfully running"});
  });
  
  //health check
  app.get("/health", (req, res) => {
    res.json({ message: "Server is healthy..😃" });
  });


  //define routes
  app.use('/api/v1/user',userRoute)





//error handler
app.use(errorHandler);













export default app;