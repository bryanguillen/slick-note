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

//**WILL CLEAN UP SOME OF THE CALLBACKS BELOW AFTER SOLVING PROBLEM. GOING OFF OF
//MONGOOSE DOCS.

//catching the favicon 
router.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

//account mgmt
router.get('/signout', (req, res) => {
	res.clearCookie('id').json({successMessage: "congrats you have signed off!"});
});

//UPDATING TITLES IF USER WANTS TO
router.put('/update-titles', jsonParser, (req, res) => {
	Note
		.findByIdAndUpdate({"_id": req.cookies.noteid}, 
			{ $set: {"title": req.body.title, "subtitle": req.body.subtitle}}, 
			{new: true}, //save new value here. 
			function(err, doc) {
				if (err) {console.log(err)};
				console.log(doc);
				res.sendStatus(204);
		})
});

//UPDATING THE ACTUAL NOTE CONTENT
router.put('/update-notes', jsonParser, (req, res) => {
	Note
		.findByIdAndUpdate({"_id": req.cookies.noteid}, 
			{$set: {"notes": req.body.notes}}, 
			{new: true}, 
			function(err, doc) {
				if (err) {console.log(err)};
				console.log(doc);
				res.sendStatus(204);
			})
});

//GETTING AND CREATING THE NEW NOTE TITLE AND SUBTITLE
router.get('/new-note', (req, res) => {
	res.clearCookie('noteid').json({successMessage: "Hello world!"});
});

router.post('/new-note', jsonParser, (req, res) => {
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
	   	 	.then(res.cookie('noteid', note._id).sendStatus(201))
	   	 	.catch(err => {
	   	 		console.log(err);
	   	 		res.sendStatus(500).json({errorMessage: "error"});
	   	 	})
	});
});

//GET the notes from click on feed
router.get('/note', jsonParser, (req, res) => {
	Note
		.findOne({"user": req.query.user, "title": req.query.title, "subtitle": req.query.subtitle})
		.exec(function(err, note) {
	 		if (err) {return console.log(err)};
	 		res.cookie('noteid', note._id).json(note.noteAPIRepr());
		})
})

//GET THE USER INFORMATION FOR WHEN THEY FIRST LOGIN
router.get('/:id' + '.json', (req, res) => {
	User 
		.findById(req.params.id)
		.populate('userNotes')
		.exec()
		.then(user => res.json(user.apiRepr()))
		.catch(err => {
		 	console.log(err);
		 	res.sendStatus(500).json({errorMsg: "internal server error"});
		})
});

router.get('/:id', (req, res) => {
	User
		.findById(req.params.id)
		.exec()
		.then(res.clearCookie('noteid').cookie('id', req.params.id).sendFile(__dirname + '/public/home.html')) 
		.catch(err => {
		  	console.log(err);
		  	res.sendStatus(500).json({errorMsg: "internal server error"});
		})
});

module.exports = router;