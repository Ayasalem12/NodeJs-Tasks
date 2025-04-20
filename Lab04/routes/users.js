const express = require('express');
const router = express.Router();
const { save, getAll, getById,deleteUser, update,login } = require('../controller/users');
const { getByUserId } = require('../controller/todos');
const {auth} = require('../middleware/authorization')
// POST /users - Register a user
router.post('/', save);
// POST /users - login a user
router.post('/login', login);

// GET /users - Get first names of users
router.get('/',auth,getAll);
router.get('/:id',auth ,getById);

// DELETE /users/:id - Delete a user
router.delete('/:id',auth,deleteUser);

// PATCH /users/:id - Update a user
router.patch('/:id',auth,update);
/// GET /users/:userId/todos - Fetch todos for a user
router.get('/:userId/todos',auth,getByUserId);
module.exports = router;