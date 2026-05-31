const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB.");
    } catch(err){
        console.log("Failed to connect to DB: ", err);
        process.exit(1);
    }
}

module.exports = connectDB;