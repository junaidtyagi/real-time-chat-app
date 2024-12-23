const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        min:8,
        required:true,
    },
    profilePic:{
        type:String,
        required:false,
    },
},{timestamps:true});

module.exports = mongoose.model('users', userSchema);