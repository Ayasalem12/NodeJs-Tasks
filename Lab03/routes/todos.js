const express = require('express');
const router = express.Router();
const { getAll, getById, save,update, deleteTodo } = require('../controller/todos');

// GET /todos - Fetch all todos
router.get('/', getAll);

// GET /todos/:id - Fetch a single todo by ID
router.get('/:id', getById);

// POST /todos - Create a new todo
router.post('/', save);

// PATCH /todos/:id - Update a todo partially
router.patch('/:id', update);

// DELETE /todos/:id - Delete a todo
router.delete('/:id', deleteTodo);


module.exports = router;