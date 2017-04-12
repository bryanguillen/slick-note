const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const {User} = require('./model');

//more dependencies and imports
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.get('/:username.json', (req, res) => {
	User 
		.findOne({"username": req.params.username})
		.exec()
		.then(user => res
			.json(user.apiRepr())
			)
		.catch(err => {
			console.log(err);
			res.status(500).json({errorMsg: "internal server error"});
		})
});

router.get('/:username', (req, res) => {
	User
		.findOne({"username": req.params.username})
		.exec()
		.then(user => res
			.cookie('username', req.params.username)
			.sendFile(__dirname + '/public/home.html')
			)
		.catch(err => {
			console.log(err);
			res.status(500).json({errorMsg: "internal server error"});
		})
})

router.get('/:id', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/note.html'));
});

module.exports = router;