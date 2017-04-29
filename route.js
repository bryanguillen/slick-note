const express = require('express');
const router = express.Router();
const {User} = require('./model')
const passport = require('passport');
const {userController, noteController} = require('./controller');
const bodyParser = require('body-parser');
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

router.post('/users', userController.createNewUser);
router.get('/logout', userController.signout); 
router.post('/login', passport.authenticate('local-signup', { failureRedirect: '/login' }), userController.redirectHome)

router.get('/user/:id', require('connect-ensure-login').ensureLoggedIn(), userController.getHomePage); 
router.get('/note/:noteId', require('connect-ensure-login').ensureLoggedIn(), noteController.getNote); //GET note on click
router.delete('/note/:noteId', require('connect-ensure-login').ensureLoggedIn(), noteController.deleteNote); 
router.get('/note/:noteId/sections', require('connect-ensure-login').ensureLoggedIn(), noteController.getSections);
router.get('/note/:noteId/section/:sectionId', require('connect-ensure-login').ensureLoggedIn(), noteController.getSection) //check
router.put('/note/:noteId', require('connect-ensure-login').ensureLoggedIn(), noteController.updateNote); 
router.post('/note/:noteId', require('connect-ensure-login').ensureLoggedIn(), noteController.createNote);
router.post('/new-note', require('connect-ensure-login').ensureLoggedIn(), noteController.startNote);

module.exports = router;