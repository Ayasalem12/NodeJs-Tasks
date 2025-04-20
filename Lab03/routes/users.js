const express = require('express');
const router = express.Router();
const { save, getAll, getById,deleteUser, update } = require('../controller/users');
const { getByUserId } = require('../controller/todos');
// POST /users - Register a user
router.post('/', save);

// GET /users - Get first names of users
router.get('/', getAll);
router.get('/:id', getById);

// DELETE /users/:id - Delete a user
router.delete('/:id', deleteUser);

// PATCH /users/:id - Update a user
router.patch('/:id', update);
/// GET /users/:userId/todos - Fetch todos for a user
router.get('/:userId/todos', getByUserId);
module.exports = router;