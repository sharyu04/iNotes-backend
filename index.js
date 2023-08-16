const ConnectToMongo = require('./db');
const express = require('express');
var cors = require('cors')
require('dotenv').config();

ConnectToMongo();

const app = express();
const port = process.env.port || 5000;
 
app.use(cors())

app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.listen(port,()=>{
    console.log(`Example app listning at http://localhost:${port}`);
})