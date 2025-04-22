// validation/todos.validation.js
const Joi = require('joi');
const mongoose = require('mongoose');

const createTodoSchema = Joi.object({
    title: Joi.string().trim().min(5).max(20).required().messages({
        'string.min': 'Title must be at least 5 characters',
        'string.max': 'Title cannot exceed 20 characters',
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
    status: Joi.string().valid('to-do', 'in progress', 'done').default('to-do').messages({
        'any.only': 'Status must be either "to-do", "in progress", or "done"',
        'any.required': 'Status is required',
    }),
    
});

const updateTodoSchema = Joi.object({
    title: Joi.string().trim().min(5).max(20).required().messages({
        'string.min': 'Title must be at least 5 characters',
        'string.max': 'Title cannot exceed 20 characters',
        'string.empty': 'Title is required',
        'any.required': 'Title is required',
    }),
    status: Joi.string().valid('to-do', 'in progress', 'done').default('to-do').messages({
        'any.only': 'Status must be either "to-do", "in progress", or "done"',
        'any.required': 'Status is required',
    }),
});

module.exports = { createTodoSchema, updateTodoSchema };