//some code from Aryan
// parampreet kaur 
import mongoose from "mongoose";
import app from "./app.js"
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error);
  });

//12
// 34