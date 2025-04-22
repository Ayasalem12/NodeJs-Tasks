const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const todosSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        minlength: [5, 'Title must be at least 5 characters'],
        maxlength: [20, 'Title cannot exceed 20 characters'],
    },
    status: {
        type: String,
        enum: ['to-do', 'in progress', 'done'],
        default: 'to-do',
    },
}, {
    timestamps: true, 
});

const todoModel = model('Todos', todosSchema);
module.exports = todoModel;