const mongoose = require('mongoose')
const {Schema} = mongoose

const NotesSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true,
    },
    tag : {
        type : String,
        default : "General"
    },
    timestamp : {
        type : Date,
        default : Date.now
    },
});

//First argument is name of the model, here we have taken it as user
module.exports = mongoose.model('notes',NotesSchema)