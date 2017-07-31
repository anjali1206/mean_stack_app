var mongoose = require('mongoose'); //import mongoose
var Schema = mongoose.Schema; //to use mongoose method Schema and store it in var Schema
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
});

//before saving the schema encrypt the password: (for info.visit-http://mongoosejs.com/docs/middleware.html)
UserSchema.pre('save', function(next) {
  var user = this; //whatever user is running through this middlware.
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


module.exports = mongoose.model('User', UserSchema); //to export the model with User schema