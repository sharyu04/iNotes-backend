const mongoose = require('mongoose');
require('dotenv').config();
// const mongoURI = "mongodb://localhost:27017/inotebook"; 
const mongoURI = process.env.mongoURI; 

const ConnectToMongo = () =>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = ConnectToMongo;