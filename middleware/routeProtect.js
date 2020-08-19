const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/userSchema')
module.exports=async(req,res,next)=>{
    const authorization = req.headers.authorization;
    //console.log(req.headers)
    //authorization === 'Bearer ladafdkfgsfgsd'
    if(!authorization){
       return res.json({error:'please login!!'});
    }
    
    //take out the header first
    const token=authorization.replace('Bearer ','')
    
    //verify the token
    jwt.verify(token,process.env.JWT_SECRET,async(err,payload)=>{
        if(err){
           return res.json('unauthorized user!')
        }
        //assigned _id at auth.js =>    const token = jwt.sign({_id:find._id},process.env.JWT_SECRET)
        const {_id} = payload; 
        try {
            var user = await User.findById(_id);
            if(!user)
            {
                return res.json(err);
            }
            //attach all the user detail to req, so we can use it verify user info
            //at protected routes
            req.user=user;
            next();
        } catch (error) {
            return res.json(err)
        }
        
       
    })
}