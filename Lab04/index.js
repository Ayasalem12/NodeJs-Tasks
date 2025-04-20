const fs = require('fs').promises;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todosRoutes = require('./routes/todos');
const usersRoutes = require('./routes/users');
const port = 3000;

dotenv.config();

// Middleware
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', './views'); // Set the views directory
// Routes
app.use('/todos', todosRoutes);
app.use('/users', usersRoutes);

// Custom 404 Middleware 
app.use((req, res, next) => {
  res.status(404).json({ status: "fail", message: "Route not found" });
});

// Error-Handling Middleware 
app.use((err, req, res, next) => {
  res.status(500).json({ status: "fail", message: "Something went wrong, try again later" });
});

mongoose.connect('mongodb://127.0.0.1/mydb', {})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});