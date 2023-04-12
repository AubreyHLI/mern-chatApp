const express = require('express');
const router = express.Router();

// use the model
const User = require('../models/UserModel');

// POST request on the users/ router
router.post('/', async(request, response) => {
    // signup => create newUser to database
    try {
        const { name, email, password, picture } = request.body;
        console.log(request.body);
        const newUser = await User.create({
            name: name,
            email: email,
            password: password,
            picture: picture
        });
        response.status(201).json(newUser); // status 201 : created
    } catch (err) {
        let errMsg;
        if(err.code === 11000) {
            errMsg = '用户已存在'
        } else {
            errMsg = err.message;
        }
        console.log(err);
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


module.exports = router;
