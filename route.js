const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const {User} = require('./model')
const passport = require('passport');
const {userController, noteController} = require('./controller');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

//passport strategy
const LocalStrategy = require('passport-local').Strategy;

//straight out of passport docs.
passport.use('local-signup', new LocalStrategy({
	 	usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
	},
  	function(req, username, password, done) {
   		User
   		.findOne({ username: username })
   		.exec()
   		.then(function (err, user) {
      		if (err) { return done(err); }
      		if (!user) {
        		return done(null, false, { message: 'Incorrect username.' });
      		}
      		if (!user.validatePassword(password)) {
        		return done(null, false, { message: 'Incorrect password.' });
      		}
      		return done(null, user);
    	});
  	}
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    if (err) { return done(err); }
    done(null, user);
  });
});

function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
router.use(passport.initialize()); //has to be another way to protect api endpoints. 
router.use(passport.session());

router.get('/user/:id', userController.getHomePage); 
router.get('/note/:noteId', noteController.getNote); //GET note on click
router.delete('/note/:noteId', noteController.deleteNote);
router.put('/note/:noteId', noteController.updateNote);
router.post('/new-note', noteController.createNote);
router.post('/users', userController.createNewUser);
router.get('/logout', userController.signout);
router.get('/login', (req, res) => {
	return res.sendFile(__dirname + '/public/login.html');
})
// router.post('/login', passport.authenticate('local-login', 
// 	{successRedirect: '/user/' + req.user, failureRedirect: '/login'}));

module.exports = router;