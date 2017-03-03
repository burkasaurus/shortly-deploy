var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');

var db = require('../models/config');

var User = require('../models/User');
var Link = require('../models/Link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({}, function(err, data) {
    res.status(200).send(data);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  res.send('WROGNNNN');

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne({url: uri}, function(err, link) {
    if (link) {
      res.status(200).send(link);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        var newLink = new Link({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        });
        
        newLink.save(function(err, newLink) {
          res.status(200).send(newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (!user) {
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(err, matched) {
        if (err) {
          res.status(500).send();
          throw err;
        }

        if (matched) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username}, function(err, user) {

    if (!user) {
      var newUser = new User({
        username: username,
        password: password
      });

      newUser.save(function(err, newUser) {
        if (err) {
          res.status(500).send();
          throw err;
        }

        util.createSession(req, res, newUser);
      });
    } else {
      res.redirect('signup');
    }
  });
};

exports.navToLink = function(req, res) {

  Link.findOne({ code: req.params[0] }, function(err, link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.vists++;
      link.save(function(err, link) {
        if (err) {
          res.status(500).send();
          throw err;
        }

        res.redirect(link.url);
      });
    }
  });
};