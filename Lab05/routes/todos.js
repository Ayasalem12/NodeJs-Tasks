const express = require('express');
const router = express.Router();
const { getAll, getById, save, update, deleteTodo } = require('../controller/todos');
const todosModel = require('../Models/todos');
const { auth, restrictTo } = require('../middleware/auth');
const {catchAsync} = require('../utlis/catchAsync');
const { validation } = require('../middleware/validation');
const { createTodoSchema, updateTodoSchema } = require('../validation/todos.validation');

// GET /todos - Fetch all todos
router.get('/', auth, restrictTo('user', 'admin'), getAll);

// GET /todos/view - Render todos view
router.get('/view',catchAsync(async (req, res, next) => {
    const todos = await todosModel.find().populate('userId');
    res.render('todos', { todos });
}));

// GET /todos/:id
router.get('/:id', getById);

// POST /todos - Create a new todo
router.post('/',auth, restrictTo("admin","user"),validation(createTodoSchema), save);

// PATCH /todos/:id - Update a todo 
router.patch('/:id', validation(updateTodoSchema), update);

// DELETE /todos/:id - Delete a todo
router.delete('/:id', deleteTodo);

module.exports = router;