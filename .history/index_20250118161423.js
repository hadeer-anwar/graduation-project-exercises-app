
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
dotenv.config({
    path: "./.env"
})
const db = process.env.DB_URI
mongoose.connect(db).then(async()=>{
    console.log("Database Is Connected ✅");
}).catch(err => {
    console.error("Failed to connect to database", err);
});
app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 5000");
})