const fs = require('fs').promises; 
const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Middleware
app.use(express.json());

// ReadFile
const readTodos = async () => {
    try {
        const data = await fs.readFile('data.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
       return []
    }
};

// WriteFile
const writeTodos = async (todos) => {
    try {
        await fs.writeFile('data.json', JSON.stringify(todos, null, 2)); // null, 2 عشان التنسيق
    } catch (err) {
        console.error('Error writing to file:', err);
        throw err;
    }
};

// GET /todos 
app.get('/todos', async (req, res) => {
    try {
        const todos = await readTodos();
        const limit = parseInt(req.query.limit) || todos.length;    
        const skip = parseInt(req.query.skip) || 0;
        if (isNaN(limit) || isNaN(skip) || limit < 0 || skip < 0) {
            return res.status(400).json({ message: 'Invalid limit or skip' });
        }
        const data = todos.slice(skip, skip + limit);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data' });
    }
});

// GET /todos/:id
app.get('/todos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const todos = await readTodos();
        const todo = todos.find((todo) => todo.id === id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.status(200).json(todo);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data' });
    }
});

// POST /todos
app.post('/todos', async (req, res) => {
    try {
        const { title, status = 'new' } = req.body; 
        const valid_status = ['new', 'in_progress', 'done'];

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (status && !valid_status.includes(status)) {
            return res.status(400).json({
                message: `Invalid status, should be one of: ${valid_status.join(', ')}`,
            });
        }

        const todos = await readTodos();
        const new_id = todos.length > 0 ? todos[todos.length - 1].id + 1 : 1;
        const newTodo = {
            id: new_id,
            title,
            status,
        };

        todos.push(newTodo);
        await writeTodos(todos);
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(500).json({ message: 'Error adding data' });
    }
});

// DELETE /todos/:id
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const todos = await readTodos();
        const index = todos.findIndex((todo) => todo.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        todos.splice(index, 1);
        await writeTodos(todos);
        res.status(200).json({ message: 'Todo deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting data' });
    }
});

// PATCH /todos/:id
app.patch('/todos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { title, status } = req.body;
        const valid_status = ['new', 'in_progress', 'done'];

        const todos = await readTodos();
        const index = todos.findIndex((todo) => todo.id === id);

        if (index === -1) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (status && !valid_status.includes(status)) {
            return res.status(400).json({
                message: `Invalid status, should be one of: ${valid_status.join(', ')}`,
            });
        }

        if (title) todos[index].title = title;
        if (status) todos[index].status = status;

        await writeTodos(todos);
        res.status(200).json({ message: 'Todo updated', todo: todos[index] });
    } catch (err) {
        res.status(500).json({ message: 'Error updating data' });
    }
});