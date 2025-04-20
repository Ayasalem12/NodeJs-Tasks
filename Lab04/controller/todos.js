const usersModel = require('../Models/users');

const todosModel = require('../Models/todos')

// GET /todos 
exports.getAll= async (req, res) => {
    try {
        let {limit,skip,render}= req.params
        if(!limit || !skip){
            let todos = await todosModel.find().populate('userId')
            res.status(200).json({message:'Success get data',data:todos})
        } 
        else{
            let todos = await todosModel.find().limit(limit).skip(skip).populate('userId')
            // res.status(200).json({message:'Success get data',data:todos})
        }
        if (render === 'true') {
            // Render Pug view
            res.render('todos', { todos });
        } else {
            // Return JSON API response
            res.status(200).json({ message: 'Success get data', data: todos });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data',error: err.message});
    }
};

// GET /todos/:id
exports.getById= async (req, res) => {
    try {
        // validation objectId
        let {id}= req.params
        let todo = await todosModel.findById(id)
        if(!todo){
            return res.status(404).json({status:'faild', message: 'This is id not found '});
        }
        res.status(200).json({message:'Success get data',data:todo})
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving data',error: err.message});
    }
};
// GET /users/:userId/todos - get todos user create it 
exports.getByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const userExists = await usersModel.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }
        const todos = await todosModel.find({ userId });
        res.status(200).json({ message: 'Success get user todos', data: todos });
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving todos', error: err.message });
    }
};
// POST /todos
exports.save= async (req, res) => {
    try {
        let {title,status,userId} = req.body
        let todo = await todosModel.create({title:title.trim(),status:status,userId:userId})
        res.status(201).json({message:'Success create data',data:todo})
    } catch (err) {
        res.status(500).json({ message: 'Error create data!' ,error: err.message});
    }
};
// delete /todos/:id
exports.deleteTodo= async (req, res) => {
    try {
        let {id} = req.params
        let todo = await todosModel.findByIdAndDelete(id)
        if(!todo){
            return res.status(404).json({status:'faild', message: 'This is id not found'})
        }
        res.status(200).json({message:'Success delete data',data:null})
    }catch(err){
        res.status(500).json({ message: 'Error delete data!',error: err.message });
    }
}
// update /todos/:id
exports.update= async (req, res) => {
    try {
        let {id} = req.params
        let {title,status} = req.body
        let todo = await todosModel.findByIdAndUpdate(id,{title:title.trim(),status:status},{new:true})
        if(!todo){
            return res.status(500).json({status:'faild', message: 'This is id not found'})
        }
        res.status(200).json({message:'Success update data',data:todo})
    }
    catch(err){
        res.status(500).json({ message: 'Error update data!',error: err.message });
    }
}

