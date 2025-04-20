const fs = require('fs').promises; 
const express = require('express');
const todosRoutes = require('./routes/todos')
const usersRoutes = require('./routes/users')
const app = express();
const mongoose = require('mongoose');
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Middleware
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1/mydb', {
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Connection error:', err));

app.use('/todos',todosRoutes)
app.use('/users',usersRoutes)


