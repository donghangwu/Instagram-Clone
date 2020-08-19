const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/postSchema')
const routeProtect = require('../middleware/routeProtect')



//generate everyone's post
//might use for guest users
router.get('/publicpost',async(req,res)=>{
    try {  
        posts = await Post.find().populate("postBy","_id name img")
                                .populate('comments.postBy')
                                .populate('likeBy');
        res.json({posts});

    } catch (error) {
        console.log(error);
    }
})
//generate user's post
//protect this route for user only
router.get('/userpost',routeProtect,async(req,res)=>{
    //only find the login user's post
    try {
        var userpost=await Post.find({postBy:req.user._id})
                           .populate("postBy");
        //if no post found, pass user's info                    
        if(userpost.length==0)
        {
            var userinfo=req.user;
            userpost.push(userinfo);
        }
        res.json(userpost);

    } catch (error) {
        console.log('error',error); 
    }
    
})

//generate user's following's post
router.get('/followingpost',routeProtect,async(req,res)=>{
    try {  
        // if postBy in following lis t
        posts = await Post.find({postBy:{$in:req.user.following}})
                                .populate("postBy","_id name img")
                                .populate('comments.postBy')
                                .populate('likeBy');
        res.json({posts});

    } catch (error) {
        console.log(error);
    }
})



// create a new post
//route /newpost
router.post('/newpost',routeProtect,async(req,res)=>{
    const content = req.body.content;
    const picture = req.body.picture;
    if(content==null)
    {
        //return at here
        return res.send('please enter all the fields')
    }
    const newpost = new Post({
        content:req.body.content,
        picture:picture,
        postBy:req.user
    })
    try {
        var result=await Post.create(newpost);
        res.json(result);
        
    } catch (error) {
        console.log(error);
    }

})

//like a post
router.put('/like',routeProtect,async(req,res)=>{

    try {        
            var result = await Post.findByIdAndUpdate(req.body.postId,{
                $push:{likeBy:req.user._id}
            },{new:true}).populate('likeBy');
            res.json(result);
        
       
    } catch (error) {
        console.log(error);   
    }
})


//routeProtect will attach user info to req.user
//unlike a post
router.put('/unlike',routeProtect,async(req,res)=>{

    try {
        //postId will be passed by front end in request
        var result = await Post.findByIdAndUpdate(req.body.postId,{
            $pull:{likeBy:req.user._id}
        },{new:true}).populate('likeBy');
        res.json(result);
    } catch (error) {
        console.log(error);   
    }
})

//comment on a post
//routeProtect will attach user info to req.user
router.put('/comment',routeProtect,async(req,res)=>{

    const newComment={
        content:req.body.content,
        postBy:req.user._id
    };
    try {
        //postId will be passed by front end in request
        var result = await Post.findByIdAndUpdate(req.body.postId,{
            $push:{comments:newComment}
        },{new:true}).populate("comments.postBy").populate('postBy')
        res.json(result);
    } catch (error) {
        console.log(error);   
    }
})

router.put('/deletecomment',routeProtect,async(req,res)=>{

    const newComment={
        content:req.body.content,
        postBy:req.user._id
    };
    try {
        //postId will be passed by front end in request
        var result = await Post.updateOne({_id:req.body.postId},
            {"$pull":{"comments":{"_id":req.body.commentId}}},{safe:true,multi:true})
        res.json(result);
    } catch (error) {
        console.log(error);   
    }
})




router.delete('/deletepost/:postId',routeProtect,async(req,res)=>{
    try {
        var result =await Post.findByIdAndRemove(req.params.postId)
    } catch (error) {
        console.log('delete Err:',error)
    }
})


module.exports=router;