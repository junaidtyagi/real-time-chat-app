const User = require("../models/user")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signup = async(req, res)=>{
   try {
     const user = await User.findOne({email:req.body.email});
     if (user){
        return res.json({
            status:"failled",
            message:"user allready exist "
        })
     }
      const hashPassword = await bcrypt.hash(req.body.password , 10);
      req.body.password = hashPassword;
     const newUser = new User(req.body);
     await newUser.save();
     res.status(201).json({
        status:"success",
        message:"user successfully created",
        data:[
            newUser
        ]
        
     })
   } catch (error) {
     res.json({
        status:"Failled",
        message:error.message
     })
   }
}


exports.login = async (req, res)=>{
  try {
   const user = await User.findOne({email:req.body.email});
   if (!user){
      return res.json({
         status:"failled",
         message:"user does not exist "
     })
   }
   //comparing password 
   const isEqual = await bcrypt.compare(req.body.password , user.password );
   if(!isEqual){
      return res.json({
         status:"failled",
         message:"password does not match"
     })
   }
   // if user successfully logged in , sending the json data with token
   const token= jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
   
   res.status(200).json({
      status:"success",
      message:"user logged in successfully",
      token:token
      
   })
  } catch (error) {
   res.status(400).json({
      status:"Failled",
      message:error.message
   })
  }
}