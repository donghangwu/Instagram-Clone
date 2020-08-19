const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/postSchema')
const User = require('../models/userSchema')
const routeProtect = require('../middleware/routeProtect');
const { json } = require('express');

//get one user's profile
router.get('/profile/:userid',async(req,res)=>{
    try {
        var userdata = await User.findOne({_id:req.params.userid});

        var userpost = await Post.find({postBy:req.params.userid})
                                 .populate('postBy')
        res.json({userdata,userpost})
    } catch (error) {
        console.log()
    }
})

//follow a user
//A follows B
router.put('/follow',routeProtect,async(req,res)=>{
    //first update being followed user's state
    //uesr's follower +1
    //update B's followers list
    try {

        var followedResult=await User.findByIdAndUpdate(req.body.followId,{
            $push:{followers:req.user._id}
        },{new:true});

        //update state for the user that are following other user
        //update A's following list
        var followingResult = await User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true})

        res.json({followingResult,followedResult})
    } catch (error) {
        console.log("follow error: ",error);
    }
})

//unfollow a user
//A unfollows B
router.put('/unfollow',routeProtect,async(req,res)=>{
    //first update being followed user's state
    //uesr's follower +1
    //update B's followers list
    try {

        var unfollowedResult=await User.findByIdAndUpdate(req.body.followId,{
            $pull:{followers:req.user._id}
        },{new:true});

        //update state for the user that are following other user
        //update A's following list
        var unfollowingResult = await User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.followId}
        },{new:true})

        res.json({unfollowingResult,unfollowedResult})
    } catch (error) {
        console.log("unfollow error: ",error);
    }
})

//update user profile image
router.put('/updateimg',routeProtect,async(req,res)=>{
    try {
        var result = await User.findByIdAndUpdate(req.user._id,{
            $set:{img:req.body.img}
        },{new:true})
        res.json(result)

    } catch (error) {
        console.log('update IMG err:',error)
    }
    
})


module.exports=router