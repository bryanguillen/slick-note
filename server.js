//dependencies and imports
const express = require('express');
const app = express();

//serving static files
app.use(express.static('public'));

//server listening
app.listen(process.env.PORT || 8080, function() {
	console.log('app is now listening on port 8080!')
});