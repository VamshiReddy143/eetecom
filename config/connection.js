const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()
const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("🚀connected to database")
    } catch (error) {
        console.log("❌error in database connection",error)
        process.exit(1)
    }
}

module.exports = connectDB