const mongoose = require("mongoose");
const dotenv = require("dotenv");


async function connectToDB() {

    try{
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Database connected successfully");
    }catch(err){
        console.error("Error connecting to database:", err);
    }
    
}

module.exports = connectToDB;