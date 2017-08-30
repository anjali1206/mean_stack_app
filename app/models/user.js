var mongoose = require('mongoose'); //import mongoose
var Schema = mongoose.Schema; //to use mongoose method Schema and store it in var Schema
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
    validate({
        validator: 'matches',
        arguments: /^(([a-zA-Z]{3,20})+[ ]+([a-zA-Z]{3,20})+)+$/,
        message: 'Name must be fullname with a space in between, must contain letters only with atleast 3 characters long.'
    }),

    validate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
];

var emailValidator = [
    validate({
        validator: 'isEmail',
        //arguments: /^([a-zA-Z0-9_\-\.]+)\w+@[a-zA-Z]+?\.[a-zA-Z]{2,5}$/,
        message: 'Please enter a valid email.'
    }),

    validate({
        validator: 'isLength',
        arguments: [3, 35],
        message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
    }),

];

var usernameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
    }),

    validate({
      validator: 'isAlphanumeric',
      message: 'Username must contain letters and numbers only'
    })
];

var passwordValidator = [
    validate({
        validator: 'matches',
        arguments: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])[0-9a-zA-Z\S]{8,35}$/,
        message: 'Password must be atleast 8 characters long with the mix of upper and lower case letters, numbers, symbols and no space.'
    }),

    validate({
        validator: 'isLength',
        arguments: [8, 35],
        message: 'Password must be between {ARGS[0]} and {ARGS[1]} characters'
    })
];


var UserSchema = new Schema({
    name: { type: String, require:true, validate: nameValidator },
    username: { type: String, lowercase: true, required: true, unique: true, validate: usernameValidator },
    password: { type: String, required: true, validate: passwordValidator },
    email: { type: String, lowercase: true, required: true, unique: true, validate: emailValidator },
});

//before saving the schema, encrypt the password: (for info.visit-http://mongoosejs.com/docs/middleware.html)
UserSchema.pre('save', function(next) {
    var user = this; //whoever user(this user) is running through this middleware.
    //implement bcrypt to hash the password. (https://www.npmjs.com/package/bcrypt-nodejs)
    bcrypt.hash(user.password, null, null, function(err, hash) {
        // Store hash in your password DB.
        if(err){
          return next(err);
        }
        user.password = hash;
        next();
    });
});

// Attach some mongoose hooks 
UserSchema.plugin(titlize, {
    paths: [ 'name' ], // Array of paths 
    trim: true
});

//method to validate the password
UserSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema); //to export the model with User schema



/*
bcrypt node js to encrypt the passwords
https://www.npmjs.com/package/bcrypt-nodejs#basic-usage

mongoose validator for all User form fields' validations(REGEX)
https://github.com/leepowellcouk/mongoose-validator
*/
