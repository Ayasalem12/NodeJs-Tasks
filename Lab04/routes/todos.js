const express = require('express');
const router = express.Router();
const { getAll, getById, save,update, deleteTodo } = require('../controller/todos');
const todosModel = require('../Models/todos')
const {auth} = require('../middleware/authorization')

// GET /todos - Fetch all todos
router.use(auth)
router.get('/', getAll);

// GET /todos/view - Render todos view (Pug)
router.get('/view', async (req, res) => {
    try {
        const todos = await todosModel.find().populate('userId');
        res.render('todos', { todos }); 
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving todos', error: err.message });
    }
});
// GET /todos/:id - Fetch a single todo by ID
router.get('/:id', getById);

// POST /todos - Create a new todo
router.post('/', save);

// PATCH /todos/:id - Update a todo partially
router.patch('/:id', update);

// DELETE /todos/:id - Delete a todo
router.delete('/:id', deleteTodo);


module.exports = router;