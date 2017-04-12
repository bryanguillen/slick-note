const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const {User} = require('./usersModel');
const {Note} = require('./notesModel');
const path = require('path');

//more dependencies and imports
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.get('/:username', (req, res) => {
	User 
		.findOne({"username": req.params.username})
		.exec()
		.then(user => res.json(user.apiRepr()));
	//res.sendFile(path.join(__dirname + '/public/home.html'));
});

router.get('/:id', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/note.html'));
});

module.exports = router;