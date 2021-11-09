var express = require('express');
var router = express.Router();
const fs = require('fs');
const cors = require('cors');
const { runInNewContext } = require('vm');
const { ObjectId } = require('mongodb');
const cryptoJS = require('crypto-js');


// LOGIN FOR REGISTRATED USERS 
router.post('/log-in', function(req, res, next){
  
  // find email adress
  req.app.locals.db.collection('users').findOne({"email" : req.body.email}, function (err, result){
    if (err){
      console.log("ERROR");
    
    } if (result){
      
      // decrypt password from db
      let originalPassword = cryptoJS.AES.decrypt(result.password, 'admin').toString(cryptoJS.enc.Utf8);
      console.log(originalPassword);

      // check if email and password is correct
      if(result.email == req.body.email && originalPassword == req.body.password){
        res.send(result)
      } else {
        res.send(false)
      }
    
    // if email is not found 
    } else {
     res.send(false)
    }
  })
});



// ADD NEW USER 
router.post('/sign-up', function(req, res, next) {

  // crypt password 
  let cryptoPassword = cryptoJS.AES.encrypt(req.body.password, 'admin').toString();
  console.log(cryptoPassword);

  // new user details
  let newUser = {
    "email": req.body.email, 
    "password" : cryptoPassword,
    "subscriptionStatus" : req.body.subscriptionStatus
  }

  console.log(newUser);
  console.log(req.body.email);

  // check if email exists in db 
  req.app.locals.db.collection('users').findOne({"email" : req.body.email}, function (err, result){
    if (err){
    console.log("ERROR");
  
    // if email already exist
    } if (result){
      console.log("Email already exist")
      res.send(false);
  
    // add new user to db 
    } else {
      req.app.locals.db.collection('users').insertOne(newUser)
      res.send(true)
    }
  })
})






module.exports = router;