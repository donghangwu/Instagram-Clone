const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = require('../models/userSchema')
//hasing the password
const bcrypt = require('bcryptjs')
//passport user token
const jwt = require('jsonwebtoken')
require('dotenv').config({path:'./config/.env'})

//protect route middleware
const routeProtect = require('../middleware/routeProtect');





router.post('/signup',async(req,res)=>{
   const {name,email,password} = req.body;

   if(!name||!email||!password)
   {
       //do not keep going, exit right here
       return res.json({error:'Please enter all the fields'})
   }
   else{
      var exist= await User.findOne({email:email});
      if(exist)
      {
          return res.json({exist:'user already exist!'})
      }
      try{
        //encrpte the password
        req.body.password= await bcrypt.hash(req.body.password,12)

        await User.create(req.body);
        res.json({success:'Successful created user'})
      }catch(err){
            return res.json(err);
      }
      
   }
})

router.post('/login', async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.json({error:'please enter all fields'})
    }
    var user = await User.findOne({email:email});
    if(!user){
        return res.json({error:'wrong email adress'})
    }
    //compare the password return true or false
    var check= await bcrypt.compare(password,user.password);
    if(!check){
        return res.json({error:'wrong password'})
    }
    //generate a token for the login user
    //use _id to find the user info from database
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET)
    res.json({token,user})
})

module.exports = router