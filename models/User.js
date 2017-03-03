var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var hash = function(password) {
  return bcryptSync();
};

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  var user = this;

  // only if not hashed before
  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, matched) {
    if (err) {
      return callback(err, null);
    }

    callback(null, matched);
  });
};

module.exports = mongoose.model('User', userSchema);