const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const postSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true
    }, 
    picture:{
        //store the img url
        type:String,
        required:true
    },
    comments:[{
        content:String,
        postBy:{
            type:ObjectId,
            ref:'user'
        }
    }],
    //array of userSchema
    likeBy:[{
        type:ObjectId,
        ref:'user'
    }],
    postBy:{
        //_id of the user who posted
        type: ObjectId,
        //build a relation in mongoDB
        ref:"user",
        required:true

    }
})

module.exports= mongoose.model("post",postSchema)
