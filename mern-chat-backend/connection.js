// connect to db
const mongoose = require('mongoose');
const dotenv = require ('dotenv');

dotenv.config();
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@mernapp.j3ibn52.mongodb.net/chatAppMern?retryWrites=true&w=majority`)
    .then(() => {
        console.log('connect to mongoDB');
    }).catch(error => {
        console.log(error);
    });
