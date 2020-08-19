const mongoose = require('mongoose');
//connecting to MongoDB
const connectMongo= async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log('connected to mongoDB',conn.connection.host);

    }catch(error)
    {
        console.error(error);
        process.exit(666);
    }
}

module.exports=connectMongo;