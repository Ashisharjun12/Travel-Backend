import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import errorHandler from "./middlewares/ErrorHandler.js";
import userRoute from "./routes/userRoute.js";
import travelRoute from "./routes/travelRoute.js";
import adminRoute from "./routes/adminRoute.js";


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
    res.json({message:"server is successfully running..."});
  });
  
  //health check
  app.get("/health", (req, res) => {
    res.json({ message: "Server is healthy..😃" });
  });


  //define routes
  app.use('/api/v1/user',userRoute)
  app.use('/api/v1/admin', adminRoute)
  app.use('/api/v1/travel', travelRoute)
  





//error handler
app.use(errorHandler);













export default app;