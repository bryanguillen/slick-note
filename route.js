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
//WILL TEST AFTER DONE. 
//**WILL CLEAN UP SOME OF THE CALLBACKS BELOW AFTER SOLVING PROBLEM. GOING OFF OF
//MONGOOSE DOCS.

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

//DELETE notes from click on feed
//ALSO DELETE FROM THE USERS ARRAY!
router.delete('/note/:noteId', (req, res) => {
	Note
		.findByIdAndRemove(req.params.note_id)
		.exec()
		.then(res.status(204).end()) 
		.catch(err => {
			console.log(err);
			res.status(500).json({errorMsg: "internal server error"});
		})
})

//UPDATING THE ACTUAL NOTE CONTENT
router.put('/note/:noteId', jsonParser, (req, res) => {
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
router.get('/new-note', (req, res) => {
	//unsure of how to use err handling middle ware for now just use try ... catch. 
	try{
		res.status(200).json({successMessage: "get create new note"});
	}
	catch(err) {
		console.log(err);
		res.status(500).json({errorMsg: "internal server error"});
	}
});

router.post('/new-note', jsonParser, (req, res) => {
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

//GET the notes from click on feed
router.get('/note/:noteId', (req, res) => {
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

//GET THE USER INFORMATION FOR WHEN THEY FIRST LOGIN
router.get('/users/:id' + '.json', (req, res) => {
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

router.get('/users/:id', (req, res) => {
	User
		.findById(req.params.id)
		.exec()
		.then(res.cookie('id', req.params.id).status(200).sendFile(__dirname + '/public/home.html')) 
		.catch(err => {
		  	console.log(err);
		  	res.status(500).json({errorMsg: "internal server error"});
		})
});

router.get('/', (req, res) => {
	res.status(200).sendFile(__dirname + '/public/index.html', function(err) {
		if (err) {return console.log(err)};
		res.status(500).json({errorMsg: "internal server error"});
	})
});

module.exports = router;