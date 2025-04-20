
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const usersModel = require('../Models/users')

// POST /users
exports.save= async (req, res) => {
    try {
        let {username,email,password} = req.body
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Missing required fields: username, password, email are required' });
        }
        // const salt = await bcryptjs.genSalt(10);
        // const hashedPassword = await bcryptjs.hash(password, salt);
        let user = await usersModel.create({username,email,password})
        res.status(201).json({message:'Success create new user',data:user})
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Username already exists', error: err.message });
        }
        res.status(500).json({ message: 'Error create new user!' ,error: err.message});
    }
};

//Get All Users
exports.getAll = async (req, res) => {
    try {
        let users = await usersModel.find()
        res.status(200).json({message:'Success get all users',data:users})
        } catch (err) {
            res.status(500).json({ message: 'Error get all users!' ,error: err})
        }
}

//get user/:id
exports.getById = async (req, res) => {
    try {
        let {id} = req.params
        let user = await usersModel.findById(id)
        res.status(200).json({message:'Success to get user data',data:user})
        } catch (err) {
            res.status(500).json({ message: 'Error to get user data!' ,error: err})
        }
}
//update user/:id
// exports.update = async (req, res) => {
//     try {
//         let {id} = req.params
//         let {username,email,firstName,lastName,password} = req.body
//         if (!username || !password || !firstName || !lastName || email) {
//             return res.status(400).json({ message: 'Missing required fields: username, email ,password, firstName, and lastName are required' });
//         }
//         let update_user ={}
//         update_user.username = username
//         update_user.email = email
//         update_user.password = password
//         update_user.firstName = firstName
//         update_user.lastName = lastName
//         // let user = await usersModel.create({username,email,firstName,lastName,password})
//         let user = await usersModel.findByIdAndUpdate(id,update_user)
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({message:'Success to update user '})
//         } catch (err) {
//             if (err.code === 11000) {
//                 return res.status(400).json({ message: 'Username or email already exists', error: err.message });
//             }
//             res.status(500).json({ message: 'Error to update user !' ,error: err})
//         }
// }
exports.update = async (req, res) => {
    try {
        let { id } = req.params; 
        let { username, email, password } = req.body;
        let updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = password;

        let user = await usersModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User was edited successfully', user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists', error: err.message });
        }
        res.status(400).json({ message: 'Error updating user', error: err.message });
    }
};
//delete user/:id
exports.deleteUser = async (req, res) => {
    try {
        let {id} = req.params
        let user = await usersModel.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({message:'Success to delete user '})
        } catch (err) {
            res.status(500).json({ message: 'Error to delete user !' ,error: err})
        }
}

exports.login = async(req,res)=> {
    try{
        const{email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:'Please enter email and password '})
        } 
        const user = await usersModel.findOne({email})
        if(!user) return res.status(404).json({message:'User not found '})
        const isValidPassword = await bcryptjs.compare(password,user.password)
        if(!isValidPassword) return res.status(400).json({message:'Invalid password '})
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({message:'User logged in successfully',data:{token}})
    }catch(err){
        res.status(500).json({ message: 'Error to login user !' ,error:err})
    }
}
