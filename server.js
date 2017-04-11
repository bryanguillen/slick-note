//dependencies and imports
const express = require('express');
const morgan = require('morgan');
const app = express();

//serving static files
app.use(express.static('public'));
app.use(morgan('common'));

//** remember to add mongoose promise as a global promise. 

//start and kill server code below
//TODO: ADD CONFIG VALUES LATER, ESPECIALLY MONGOOSE VALS LATER
function runServer() {
	return new Promise((resolve, reject) => { 
		server = app.listen(process.env.PORT || 8080, function() {
			console.log('app is now listening on port 8080!')
			resolve();
		});
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Killing the server now!')
		server.close(err => {
			if(err) {
				return reject(err);
			}
			resolve();
		});
	});
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};