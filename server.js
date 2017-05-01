const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const route = require('./route');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {DATABASE_URL, TEST_DATABASE_URL, PORT} = require('./config');
require('dotenv').config()

mongoose.Promise = global.Promise;

app.use(cookieParser());
app.use(express.static('public'));
app.use(morgan('common')); //log http layer
app.use('/user', express.static('public'))
app.use('/', route); 

//start and kill server code below
function runServer(databseUrl=DATABASE_URL) {
	return new Promise((resolve, reject) => { 
		mongoose.connect(databseUrl, err => {
			if(err) {
				console.log(err);
				return reject(err);
			}
		})

		server = app.listen(process.env.PORT || 8080, function() {
			console.log(`app is now listening on port 8080 & your database is ${databseUrl}!`);
			resolve();
		})
		.on('error', err => {
			mongoose.disconnect();
			reject(err);
		})
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
	return new Promise((resolve, reject) => {
		console.log('Killing the server now!')
		server.close(err => {
			if(err) {
				return reject(err);
			}
			resolve();
		});
	});
	});
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};