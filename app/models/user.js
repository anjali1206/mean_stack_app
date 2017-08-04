var mongoose = require('mongoose'); //import mongoose
var Schema = mongoose.Schema; //to use mongoose method Schema and store it in var Schema
var bcrypt = require('bcrypt-nodejs');

var UserSchema = new Schema({
  username: { type: String, lowercase: true, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, lowercase: true, required: true, unique: true },
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

//method to validate the password
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
};


module.exports = mongoose.model('User', UserSchema); //to export the model with User schema


/*bcrypt node js to encrypt the passwords
https://www.npmjs.com/package/bcrypt-nodejs#basic-usage
*/