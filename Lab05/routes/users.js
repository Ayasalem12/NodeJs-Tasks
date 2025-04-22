const express = require('express');
const router = express.Router();
const { save, getAll, getById, deleteUser, update, login } = require('../controller/users');
const { getByUserId } = require('../controller/todos');
const { auth, restrictTo } = require('../middleware/auth');
const { validation } = require('../middleware/validation');
const registerSchema = require('../validation/register.validation');
const loginSchema = require('../validation/login.validation');
const { updateUserSchema } = require('../validation/updateUser.validation');

// POST /users - Register a user
router.post('/', validation(registerSchema), save);

// POST /users/login - Login a user
router.post('/login', validation(loginSchema), login);

// GET /users - Get all users
router.get('/', getAll);

// GET /users/:id 
router.get('/:id', auth, restrictTo('admin'), getById);

// DELETE /users/:id -
router.delete('/:id', auth, restrictTo('admin'), deleteUser);

// PATCH /users/:id - Update a user
router.patch('/:id', validation(updateUserSchema), update);

// GET /users/:userId/todos - Fetch todos for a user
router.get('/:userId/todos', auth, getByUserId);

module.exports = router;