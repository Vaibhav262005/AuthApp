const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { options } = require('../routes/user');
require('dotenv').config();


//signup ka route handler
exports.signup = async (req, res) => {
    try {
        //get the data from request body
        const { name, email, password, role } = req.body;

        //Checking if user already exists
        const existingUser = await User.findOne({email}) ;   
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        //securing the password using bcrypt
        let  hashedPassword ;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error in hashing password',
            });
        };

        //create a new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        //return a response
        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user,
        });
        
    }

    catch (error) {
        console.log('Error in signup:', error);
        res.status(500).json({
            success: false,
            message: 'Error in signup',
        });
    }
};    



//login ka route handler
exports.login = async (req, res) => {
    try {
        //get the data from request body
        const { email, password } = req.body;

        //validation of user and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        //check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist',
            });
        }


        //generate a payload
        const payload = { email: user.email, 
                          id: user._id,
                          role: user.role };

        //verify the password and generate jwt token
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid password',
            });
        }
        else {
            //generate a jwt token and send it to the user
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h'   }); 

            user.token = token;
            user.password = undefined;


            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            };

            res.cookie('token', token, options);

            //return a response
            return res.status(200).json({
                success: true,
                user,
                message: 'User logged in successfully',
                token,
            });
        }
    }
        catch (error) {
            console.log('Error in login:', error);
            res.status(500).json({
                success: false,
                message: 'Error in login',
            });
        }
    
};
