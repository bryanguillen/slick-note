const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const passport = require('passport');
const {userController, noteController} = require('./controller');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

router.use(jsonParser);

//passport strategy
const {BasicStrategy} = require('passport-http');
//straight out of passport docs.
passport.use(new BasicStrategy(
  	function(username, password, done) {
    	User.findOne({ username: username }, function (err, user) {
      		if (err) { return done(err); }
      	
      		if (!user) { return done(null, false); }
      		
      		if (!user.validatePassword(password)) { return done(null, false); }
      		
      		return done(null, user);
    	});
  	}
));
router.use(passport.initialize()); //has to be another way to protect api endpoints. 

router.get('/user/:id', passport.authenticate('basic', {session: false}), userController.getHomePage); 
router.get('/note/:noteId', noteController.getNote); //GET note on click
router.delete('/note/:noteId', passport.authenticate('basic', {session: false}), noteController.deleteNote);
router.put('/note/:noteId', passport.authenticate('basic', {session: false}), noteController.updateNote);
router.post('/new-note', passport.authenticate('basic', {session: false}), noteController.createNote);
router.post('/users', userController.createNewUser);
router.get('/logout', userController.signout);

module.exports = router;