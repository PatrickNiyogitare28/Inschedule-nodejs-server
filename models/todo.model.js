const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    user_id:{
        type: String,
        required: true
    },
    taskName:{
        type: String,
        required: true
    },
    status:{
        type:Number,
        required: true
    },
    index: {
        type:Number,
        required:true
    }
})

const Todo = new mongoose.model('Todo',Schema)
module.exports.Todo = Todo;
