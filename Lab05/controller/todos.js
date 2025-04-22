// controller/todos.js
const mongoose = require('mongoose');
const usersModel = require('../Models/users');
const todosModel = require('../Models/todos');
const {catchAsync} = require('../utlis/catchAsync');
const AppError = require('../utlis/AppError');

// GET /todos 
exports.getAll = catchAsync(async (req, res, next) => {
    let { limit, skip, render } = req.params;

    if (limit) {
        limit = parseInt(limit);
        if (isNaN(limit) || limit < 1) {
            return next(new AppError(400, 'Limit must be a positive integer'));
        }
    }
    if (skip) {
        skip = parseInt(skip);
        if (isNaN(skip) || skip < 0) {
            return next(new AppError(400, 'Skip must be a non-negative integer'));
        }
    }

    if (render && !['true', 'false'].includes(render)) {
        return next(new AppError(400, 'Render must be either "true" or "false"'));
    }

    let todos;
    if (!limit || !skip) {
        todos = await todosModel.find().populate('userId');
    } else {
        todos = await todosModel.find().limit(limit).skip(skip).populate('userId');
    }

    if (render === 'true') {
        return res.render('todos', { todos });
    } else {
        return res.status(200).json({ message: 'Success get data', data: todos });
    }
});

// GET /todos/:id
exports.getById = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError(400, 'Invalid ID format'));
    }

    let todo = await todosModel.findById(id);
    if (!todo) {
        return next(new AppError(404, 'This is id not found'));
    }
    res.status(200).json({ message: 'Success get data', data: todo });
});

// GET /users/:userId/todos
exports.getByUserId = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new AppError(400, 'Invalid User ID format'));
    }

    const userExists = await usersModel.findById(userId);
    if (!userExists) {
        return next(new AppError(404, 'User not found'));
    }

    const todos = await todosModel.find({ userId });
    res.status(200).json({ message: 'Success get user todos', data: todos });
});

// POST /todos
exports.save = catchAsync(async (req, res, next) => {
    const { title, status } = req.validatedBody;
    const userId = req.id; 
    // Check if user exists
    const userExists = await usersModel.findById(userId);
    if (!userExists) {
        return next(new AppError(404, 'User not found'));
    }

    let todo = await todosModel.create({ title: title.trim(), status, userId });
    res.status(201).json({ message: 'Success create data', data: todo });
});

// DELETE /todos/:id
exports.deleteTodo = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError(400, 'Invalid ID format'));
    }

    let todo = await todosModel.findByIdAndDelete(id);
    if (!todo) {
        return next(new AppError(404, 'This is id not found'));
    }
    res.status(200).json({ message: 'Success delete data', data: null });
});

// UPDATE /todos/:id
exports.update = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, status } = req.validatedBody;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError(400, 'Invalid ID format'));
    }

    let todo = await todosModel.findByIdAndUpdate(id, { title: title.trim(), status }, { new: true });
    if (!todo) {
        return next(new AppError(404, 'This is id not found'));
    }
    res.status(200).json({ message: 'Success update data', data: todo });
});