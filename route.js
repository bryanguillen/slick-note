const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const {User, Note} = require('./model');

//more dependencies and imports
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const cookieParser = require('cookie-parser');

router.get('/signout', (req, res) => {
	res.clearCookie('id').json({successMessage: "congrats you have signed off!"});
})

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
	   	 	.findByIdAndUpdate(
	   	 		req.cookies.id, 
	   	 		{ $push: {userNotes: note._id}},
	   	 		function (err, res) {
	   	 			if(err) {return console.log(err)};
	   	 			res.status(201);
	   	 		}
	   	 	)

	   	//res.status(201);
	})
});

router.get('/:id' + '.json', (req, res) => {
	User 
		.findById(req.params.id)
		.populate('userNotes')
		.exec((err, user) => {
			if(err) {res.send(err)};
			res.json(user.apiRepr());	
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({errorMsg: "internal server error"});
		})
});

router.get('/:id', (req, res) => {
	User
		.findById(req.params.id)
		.exec((err, user) => {
			if(err) {res.send(err)};
			res.cookie('id', req.params.id).sendFile(__dirname + '/public/home.html');
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({errorMsg: "internal server error"});
		})
});

module.exports = router;