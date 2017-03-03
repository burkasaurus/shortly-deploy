var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var linkSchema = new Schema ({
  url: {
    type: String,
    required: true
  },

  baseUrl: {
    type: String,
    required: true
  },

  code: String,

  title: String,

  visits: {
    type: Number,
    default: 0
  }
});

linkSchema.pre('save', function(next) {
  if (!this.isModified('url')) {
    return next();
  }

  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});

module.exports = mongoose.model('Link', linkSchema);
