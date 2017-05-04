const express = require('express');
const router = express.Router();
const {User} = require('./model')
const passport = require('passport');
const {userController, noteController} = require('./controller');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const jsonParser = bodyParser.json();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(jsonParser);

//passport strategy
const Strategy = require('passport-local').Strategy;

//straight out of passport docs.
passport.use('local-signup', new Strategy (function(username, password, cb) {
  let user;
  User
    .findOne({username: username})
    .exec()
    .then((_user) => {
      user = _user
      
      if (!user) {
        return cb(null, false, {message: 'Incorrect username'});
      }
      
      return user.validatePassword(password)
    })
    .then(isValid => {
      if(!isValid) {
        return cb(null, false, {message: 'Incorrect password'});
      }
      else {
        return cb(null, user);
      }
    })
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function (err, user) {
    if (err) { return done(err); }
    cb(null, user);
  });
});

router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
router.use(passport.initialize()); 
router.use(passport.session());

// , require('connect-ensure-login').ensureLoggedIn()

router.post('/users', userController.createNewUser);
router.get('/logout', userController.signout); 
router.get('/invalid-login', userController.failedLogin);
router.post('/login', passport.authenticate('local-signup', { failureRedirect: '/invalid-login' }), userController.redirectHome)
router.get('/login', userController.getLogin);

router.get('/user/:id', userController.getHomePage); //good to go

router.get('/note/:noteId', noteController.getNote); //good to go
router.delete('/note/:noteId', noteController.deleteNote); //good to go
router.put('/note/:noteId', noteController.updateNote); //good to go
router.post('/new-note', noteController.createNote); //good to go

module.exports = router;