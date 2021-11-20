var express = require('express');
var router = express.Router();
const cors = require('cors');
const cryptoJS = require('crypto-js');


// const transporter = nodemailer.createTransport()

// LOGIN FOR REGISTRATED USERS 
router.post('/log-in/:pageload?', function(req, res, next){
  
  // find email adress
  console.log(req.body)
  req.app.locals.db.collection('users').findOne({"email" : req.body.email}, function (err, result){
    if (err){
      console.log("ERROR");
    
    } if (result){
      if(!req.params.pageload) {
        let originalPassword = cryptoJS.AES.decrypt(result.password, 'admin').toString(cryptoJS.enc.Utf8);
        console.log(originalPassword);
  
        // check if email and password is correct
        if(result.email == req.body.email && originalPassword == req.body.password){
          let currentUser = { 
            email: result.email,
            subscriptionStatus: result.subscriptionStatus,
            subscription: result.subscription
           }
          
           res.send(currentUser)
  
        } else {
          res.send(false)
        }
      } else {
        let currentUser = { 
          email: result.email,
          subscriptionStatus: result.subscriptionStatus,
          subscription: result.subscription
         }
         res.json(currentUser)
      }
      // decrypt password from db
    
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
    "subscriptionStatus" : req.body.subscriptionStatus,
    "subscription" : req.body.subscription
  }

  console.log(newUser);

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
      
      let currentUser = { 
        email: req.body.email, 
        subscriptionStatus: req.body.subscriptionStatus,
        subscription: req.body.subscription
       }
      
       res.send(currentUser)
    }
  })
})

// UPDATE CURRENT USERS SUBSCRIPTION
router.post('/update-subscription', function(req, res, next) {

  console.log(req.body.email);
  console.log(req.body.subscriptionStatus);
  console.log(req.body.subscription);
  
  // find email and update subscription
  req.app.locals.db.collection('users').findOneAndUpdate({"email" : req.body.email}, { $set: {"subscription" : req.body.subscription, "subscriptionStatus" : req.body.subscriptionStatus}})

  let currentUser = { 
    email: req.body.email, 
    subscriptionStatus: req.body.subscriptionStatus,
    subscription: req.body.subscription
   }
  
   res.send(currentUser)
});
router.post('/submit', (req, res) => {
  console.log(req.body);
  req.app.locals.db.collection('users').findOne({"email" : req.body.email}, (err, result) => {
    if(err) {
      console.log(err);
    } else if (result) {
      res.json("account exists");
    } else {
      // const newPassword = generator.generate({
      //   length: 10,
      //   numbers: true
      // });

      const cryptoPassword = cryptoJS.AES.encrypt(req.body.password, 'admin').toString();
      const newDate = new Date();

      const newUser = {
        email: req.body.email,
        password: cryptoPassword,
        subscriptionStatus: true,
        subscription: {
          creationDate: newDate,
          color: req.body.color,
          quantity: req.body.quantity,
          delivery: req.body.delivery
        }
      }

      req.app.locals.db.collection('users').insertOne(newUser)
      .then(() => {

        newUser.password = req.body.password;
        res.json(newUser);
      })
    }
  })

})
router.post('/skip', (req, res) => {
  req.app.locals.db.collection('users').findOneAndUpdate({"email": req.body.email}, {$set: {"subscription.creationDate": req.body.creationDate}})
  .then(response => {
    console.log(response.value.subscription);
    res.json(response.value.subscription.creationDate);
  })
})

//DEVELOPMENT/DEBUGGING ONLY!
router.get('/show-db', (req, res) => {
  req.app.locals.db.collection('users').find().toArray()
  .then(results => {
    res.json(results);
  })
})

router.post('/delete', (req, res) => {
  req.app.locals.db.collection('users').deleteOne({email: req.body.email})
  .then(result => {
    res.send(result)
  })
})


module.exports = router;



