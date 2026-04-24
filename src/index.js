//required('dotenv').config({path: './env'});//
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { DB_NAME } from "./constants.js";


dotenv.config();



/*import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: DB_NAME,
    });
    app.once("error", (error) => {
      console.error("Error connecting to MongoDB");
    });

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;    
  }

})();*/
