const express = require('express');
const router = express.Router();
const {app, runServer, closeServer} = require('./server.js');
const path = require('path');

//more dependencies and imports
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/public/home.html'));
});

module.exports = router;