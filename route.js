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

router.post('/users', userController.createNewUser); //just create error handling markup for this page and login
router.get('/logout', userController.signout);
router.post('/login', userController.redirectHome)//passport.authenticate('local-signup', { failureRedirect: '/login' })
router.get('/user/:id', userController.getHomePage);//require('connect-ensure-login').ensureLoggedIn() 
router.get('/note/:noteId', noteController.getNote); //GET note on click
router.delete('/note/:noteId', noteController.deleteNote);
router.get('/note/:noteId/sections', noteController.getSections);
router.get('/note/:noteId/section/:sectionId', noteController.getNoteSection)
router.put('/note/:noteId', noteController.updateNote);
router.post('/note/:noteId', noteController.createNote);
router.post('/new-note', noteController.startNote);

module.exports = router;