const express = require('express');
const router = express.Router();

// use the model
const User = require('../models/UserModel');

// POST request on the users/ router
router.post('/', async(request, response) => {
    // signup => create newUser to database
    try {
        const { name, email, password } = request.body;
        const newUser = await User.create({
            name: name,
            email: email,
            password: password,
        });
        response.status(201).json(newUser); // status 201 : created
    } catch (err) {
        let errMsg;
        if(err.code === 11000) {
            errMsg = '该邮箱已被注册, 请使用其他邮箱'
        } else {
            errMsg = err.message;
        }
        console.log('serverside signup error:',err.message);
        response.status(400).json(errMsg);
    }
});


// POST request on the login router
router.post('/login', async(request, response) => {
    // login => find user in database
    try {
        const { email, password } = request.body;
        const user = await User.findByCredentials(email, password);
        // update the status to 'online' in database
        user.status = 'online';
        await user.save(); 
        response.status(200).json(user);
        console.log('login successfully');
    } catch (err) {
        response.status(400).json(err.message);
    }
});

router.post('/changePw', async(request, response) => {
    try {
        const { email, newPw, answer } = request.body;
        if(!email) {
            response.status(400).send('Email is required!');
        }
        if(!newPw) {
            response.status(400).send('New Password is required!');
        }
        if(!answer) {
            response.status(400).send('Answer is required!');
        }
        
        const user = await User.findOne({email, pwanswer: answer});
        if(!user) {
            response.status(404).send('Wrong email or answer!');
        }
        user.password = newPw;       
        await user.save(); 

        response.status(200).json(user);
    } catch (err) {
        response.status(400).json(err.message);
    }
});


module.exports = router;
