const mongoose = require('mongoose')
const connect = mongoose.connect('mongodb://localhost:27017/authentication');

// check database connected or not 
connect.then(() =>{
    console.log('Database connected Successfully')
})
.catch(() => {
    console.log('Database cannot be connected')
})

// Create A schema
const LoginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

// collection part 
const collection = new mongoose.model('user', LoginSchema)

module.exports = collection;
