const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true},
    image:{type:String},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    brand:{type:String,required:true},
    model:{type:String,required:true},
    color:{type:String,required:true},
    category:{type:String,required:true},
    discount:{type:Number,required:true}


},{timestamps:true})

module.exports =  mongoose.model("Product",ProductSchema)

