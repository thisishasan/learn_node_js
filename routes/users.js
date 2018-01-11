const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

let User = require('../models/user');

router.get('/register',function(req, res){
  res.render('register');
});


router.post('/register',function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confpassword = req.body.confpassword;

  req.checkBody('name', 'Name is required.').notEmpty();
  req.checkBody('email', 'Email is required.').notEmpty();
  req.checkBody('email', 'Invalid email.').isEmail();
  req.checkBody('username', 'Username is required.').notEmpty();
  req.checkBody('password','Password is required').notEmpty();
  req.checkBody('confPassword','Password doesnt match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors : errors
    });
  }else{
    let newUser = new User({
      name : name,
      email : email,
      username : username,
      password : password
    });
    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          }else{
            req.flash('success','You are now registered and can login.');
            res.redirect('/users/login');
          }
        });
      });
    });
  }


});

router.get('/login',function(req, res){
  res.render('login');
});

module.exports = router;
