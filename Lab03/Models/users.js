const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [8, 'Username must be at least 8 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    
    image: {
        type: String,
        required: false, 
    },
}, {
    timestamps: true, 
});

const usersModel = model('User', userSchema);
module.exports = usersModel;