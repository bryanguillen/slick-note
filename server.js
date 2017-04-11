//dependencies and imports
const express = require('express');
const app = express();

//serving static files
app.use(express.static('public'));

//** remember to add mongoose promise as a global promise. 

//server listening
function runServer() {
	return new Promise((resolve, reject) => { 
		//ADD CONFIG VALUES LATER
		server = app.listen(process.env.PORT || 8080, function() {
			console.log('app is now listening on port 8080!')
			resolve();
		});
	});
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer};