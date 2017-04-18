const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const {User, Note} = require('./model');
const path = require('path');

//more dependencies and imports
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cookieParser = require('cookie-parser');

//COMMENTS JUST FOR DEV PURPOSES

//catching the favicon 
router.get('/favicon.ico', function(req, res) {
    res.send(204);
});

//account mgmt
router.get('/signout', (req, res) => {
	res.clearCookie('id').json({successMessage: "congrats you have signed off!"});
});

//CREATING THE ACTUAL NOTE CONTENT
router.put('/note', (req, res) => {
	//we have to grab the current note and then just add the note content
	//many ways we can do this, for now I think it is safe to say that 
	//we are only going to have users with a few notes and that we can grab it by just finding it. 
});

//GETTING AND CREATING THE NEW NOTE TITLE AND SUBTITLE
router.get('/new-note', (req, res) => {
	res.json({successMessage: "Hello world!"});
});

router.post('/new-note', jsonParser, (req, res) => {
	//create the new post in the database 
	let newNote = new Note ({
	   	user: req.body.user,
	   	title: req.body.title,
	   	subtitle: req.body.subtitle
	})
	newNote.save((err, note) => {
	   	if(err) {return console.log(err)};
	   	 User
	   	 	.findByIdAndUpdate(req.cookies.id, { $push: {userNotes: note._id}})
	   	 	.exec()
	   	 	.then(note => res.status(201).json(note.apiRepr()))
	})
});

//GET THE USER INFORMATION FOR WHEN THEY FIRST LOGIN
router.get('/:id' + '.json', (req, res) => {
	User 
		.findById(req.params.id)
		.populate('userNotes')
		.exec()
		.then(user => res.json(user.apiRepr()))
		.catch(err => {
		 	console.log(err);
		 	res.status(500).json({errorMsg: "internal server error"});
		})
});

router.get('/:id', (req, res) => {
	User
		.findById(req.params.id)
		.exec()
		.then(res.cookie('id', req.params.id).sendFile(__dirname + '/public/home.html'))
		//causing favicon error over and over again. 
		.catch(err => {
		  	console.log(err);
		  	res.status(500).json({errorMsg: "internal server error"});
		})
});

module.exports = router;