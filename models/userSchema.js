const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    img:{
        type:String,
        default:'https://res.cloudinary.com/dwu20/image/upload/v1597790821/defualt2_xli5go.webp'
    },
    followers:[
        {
            type:ObjectId,
            ref:'user'
        }
    ],
    following:[
        {
            type:ObjectId,
            ref:'user'
        }
    ]
})

module.exports= mongoose.model('user',userSchema);