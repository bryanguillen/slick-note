const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const {User, Note} = require('./model');
const passport = require('passport');

//more dependencies and imports
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
					

router.use(passport.initialize());

//COMMENTS JUST FOR DEV PURPOSES

router.get('/', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/index.html', function(err) {
		if (err) {return console.log(err)};
		res.status(500).json({errorMsg: "internal server error"});
	})
});

router.get('/user/:id', passport.authenticate('basic', {session: false}), (req, res) => {
	User
		.findById(req.params.id)
		.exec()
		.then(res.cookie('id', req.params.id).status(200).sendFile(__dirname + '/public/home.html')) 
		.catch(err => {
		  	console.log(err);
		  	res.status(500).json({errorMsg: "internal server error"});
		})
});

//GET THE USER INFORMATION FOR WHEN THEY FIRST LOGIN
router.get('/user/:id' + '.json', passport.authenticate('basic', {session: false}), (req, res) => {
	User 
		.findById(req.params.id)
		.populate('userNotes')
		.exec()
		.then(user => res.status(200).json(user.apiRepr()))
		.catch(err => {
		 	console.log(err);
		 	res.status(500).json({errorMsg: "internal server error"});
		})
});

//GET the notes from click on feed
router.get('/note/:noteId', passport.authenticate('basic', {session: false}), (req, res) => {
	Note
		.findById({"_id": req.params.noteId}, function(err, note) {
	 		if (err) {
	 			console.log(err)
	 			res.status(500).json({errorMsg: "internal server error"});
	 		};
	 		res.json(note.noteAPIRepr());
	 	})
		.exec()
})

//DELETE notes from click on feed
//ALSO DELETE FROM THE USERS ARRAY!
router.delete('/note/:noteId', passport.authenticate('basic', {session: false}), (req, res) => {
	let note;
	Note
		.findByIdAndRemove(req.params.noteId, function(err, _note) {
			note = _note._id
			if(err) { 
				console.log(err);
				return res.status(500).json({errorMsg: "internal server error"}); 
			}
		})
		.exec()
		.then(function() {
			//remove the note ref object.
			User
				.findByIdAndUpdate(req.cookies.id, { $pull: {userNotes: note}})
				.exec()
				.then(res.status(204).end())
				.catch(err => {
					console.log(err)
					return res.status(500).json({errorMsg: "internal server error"})
				})
		})
})

//UPDATING THE ACTUAL NOTE CONTENT
router.put('/note/:noteId', passport.authenticate('basic', {session: false}), (req, res) => {
	//check what fields were sent via the ajax request.. then update
	let updatedFields = {};
	Object.keys(req.body).forEach(function(field) {
		//leave id out of the update 
		if (field !== "id") {
			updatedFields[field] = req.body[field];
		}
	})
	let newValues = { $set: updatedFields}
	Note
		.findByIdAndUpdate({"_id": req.params.noteId}, 
			newValues, 
			{new: true}, 
			function(err, doc) {
				if (err) {
					console.log(err);
					res.status(500).json({errorMsg: "internal server error"});
				}
				console.log(doc);
				res.status(204).end();
			})
});

//GETTING AND CREATING THE NEW NOTE TITLE AND SUBTITLE
router.get('/new-note', passport.authenticate('basic', {session: false}), (req, res) => {
	//unsure of how to use err handling middle ware for now just use try ... catch. 
	try{
		res.status(200).json({successMessage: "get create new note"});
	}
	catch(err) {
		console.log(err);
		res.status(500).json({errorMsg: "internal server error"});
	}
});

router.post('/new-note', passport.authenticate('basic', {session: false}), (req, res) => {
	//later test code by making sure each key is present when introducing new note
	//create the new post in the database 
	let newNote = new Note ({
		"user": req.body.user,
		"title": req.body.title, 
		"subtitle": req.body.subtitle,
		"notes": req.body.notes
	});

	newNote.save(function(err, note) {
		if (err) {return console.log(err)};
		User
	   	 	.findByIdAndUpdate(req.cookies.id, { $push: {userNotes: note._id}})
	   	 	.exec()
	   	 	.then(res.status(201).json(note.noteAPIRepr()))
	   	 	.catch(err => {
	   	 		console.log(err);
	   	 		res.status(500).json({errorMsg: "internal server error"});
	   	 	})
	});
});

//signing up for the user.
router.post('/users', (req, res) => {
	
	//verify that each of the fields exist after verifying that the body is not empty.
	if(!req.body) {
	 	res.status(400).json({errorMsg: "Your request is empty and invalid."})
	}
	Object.keys(req.body).forEach(function(field) {
		let submittedValue = req.body[field];
		if(submittedValue === '') {
			return res.status(422).json({errorMsg: `Incorrect Length: ${field} is empty`});
		} 
		else if(typeof submittedValue !== 'string') {
			return res.status(422).json({errorMsg: `Incorrect datatype: ${req.body[field]} is wrong field type`});	
		}
	})

 	let {email, username, password, passwordConfirmation} = req.body

 	if(password !== passwordConfirmation) {
 		return res.status(422).json({errorMsg: `Passwords do not match.`})
 	}

	email = email.trim().toLowerCase(); 
	username = username.trim().toLowerCase();
	password = password.trim();
	
	//next check if user exists then create if it does not exist. 
	return User
		.find({email})
		.count()
		.exec()
		.then(count => {
			if(count>0) { 
				return res.status(422).json({errorMsg: `This email already exists`});
			}
			return User
				.find({username})
				.count()
				.exec()
		})
		.then(count => {
			if(count>0) {
				return res.status(422).json({errorMsg: `This username already exists`});
			}
			return User.hashPassword(password)
		})
		.then(hash => {
			let newUser = new User ({
				email: email,
				username: username, 
				password: hash,
				userNotes: []
			});

			newUser.save(function(err, user) {
				if (err) {return console.log(err)};
				User
	   	 			.find(user.username)
	   	 			.exec()
	   	 			.then(res.status(201).json(user.apiRepr()))
	   	 			.catch(err => {
	   	 				console.log(err);
	   	 				res.status(500).json({errorMsg: "internal server error"});
	   	 			})
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({errorMsg: 'internal server error'})
		})
})

//account mgmt
router.get('/signout', (req, res) => {
	try{	
		res.clearCookie('id').json({successMessage: "congrats you have signed off!"});
	}
	catch(err) {
		console.log(err);
		res.status(500).json({errorMsg: "internal server error"});
	}
});

module.exports = router;