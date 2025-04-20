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
    // firstName: {
    //     type: String,
    //     required: [true, 'First name is required'],
    //     minlength: [3, 'First name must be at least 3 characters'],
    //     maxlength: [15, 'First name cannot exceed 15 characters'],
    // },
    // lastName: {
    //     type: String,
    //     required: [true, 'Last name is required'],
    //     minlength: [3, 'Last name must be at least 3 characters'],
    //     maxlength: [15, 'Last name cannot exceed 15 characters'],
    // },
    // dob: {
    //     type: Date,
    //     required: false,
    // },
    image: {
        type: String,
        required: false, 
    },
}, {
    timestamps: true, 
});

const User = model('User', userSchema);
module.exports = User;