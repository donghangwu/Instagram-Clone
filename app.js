const express = require('express');
const mongoose = require('mongoose');
//connect to the .env file
require('dotenv').config({path:'./config/.env'})

//connect to database
const mongodb=require('./config/database');
mongodb();

//create a schema variable for mongo schema
const userSchema=require('./models/userSchema')
const postSchema = require('./models/postSchema')


const app = express();
//parse the json data
app.use(express.json());

//auth route
const authroute= require('./route/auth');
app.use('/',authroute);

//post route
const postroute = require('./route/post');
app.use('/',postroute);

//user route
const userroute = require('./route/user');
app.use('/',userroute);


//listen to port
const PORT = process.env.PORT||5000;

if(process.env.NODE_ENV=="production")
{
    app.use(express.static('client/build'));
    const path = require('path');
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>
{
    console.log('server is running on',PORT);
})