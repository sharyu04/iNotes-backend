const mongoose = require('mongoose');
require('dotenv').config();
const mongoURI = process.env.mongoURI; 

const ConnectToMongo = () =>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongo successfully");
    })
}

module.exports = ConnectToMongo;