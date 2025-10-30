const mongoose = require("mongoose");
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI);

const userSchema = mongoose.Schema({
    username:String,
    email:{type:String,unique:true},
    originalpass:String,
    password:String,
    age:Number
},{timestamps:true}
)

module.exports = mongoose.model("user",userSchema);