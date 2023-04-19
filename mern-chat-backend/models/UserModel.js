const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// create a new schema
const UserSchema = new Schema({
    name: {
        type: String,
        unique: true,
        require: [true, "Can't be blank"]
    },
    email: {
        type: String,
        require: [true, "Can't be blank"],
        lowercase: true,
        unique: true,
        index: true,
        validate: [isEmail, "invalid email"]
    },
    password: {
        type: String,
        require: [true, "Can't be blank"]
    },
    picture: {
        type: String
    },
    newMessages: {
        type: Object,
        default: {}
    },
    status: {
        type: String,
        default: "online"
    }
}, { minimize: false });


// functions
// Functions added to the 'methods' property of a schema get compiled into the Model prototype and exposed on each document instance
UserSchema.methods.toJSON = function() {
    const userObj = this.toObject();   // 'this' is the instance of UserSchema which use toJSON
    delete userObj.password;
    return userObj;
}

// Schema Statics are methods that can be invoked directly by a Model (unlike Schema Methods, which need to be invoked by an instance of a Mongoose document).
UserSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne({email: email});
    if(!user) throw new Error('该用户不存在');

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch)  throw new Error('密码错误');

    return user;  //else
}


// 'pre' middleware functions, this 'pre' called before using the 'save' method
UserSchema.pre('save', function(next) {
    const user = this;
    // check if password is modified
    if(!user.isModified('password')) {
        return next();
    } 

    // else
    bcrypt.genSalt(10, function (err, salt) { // generate a salt and hash on separate function calls
        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
                
            user.password = hash; // Store hash in your password DB.
            next();
        });
    })
    
})


const User = mongoose.model('User', UserSchema);
module.exports = User;