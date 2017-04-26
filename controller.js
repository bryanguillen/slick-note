//imports
const {User, Note} = require('./model');
const {createFeedHTML, createUserHomeHTML, renderHTMLAfterLogout, renderHTMLAfterSignup} = require('./services');

let userController = {
	
	getHomePage: function (req, res) {
		//right here what we want to do is redirect the user in after 
		//loggin in. then just allow them, 
		User
			.findById(req.user._id)
			.populate('userNotes')
			.exec() 
			//get the user information. 
			.then(user => user.apiRepr())
			.then(function(json) {
				let notes = '';
				json.userNotes.forEach(function(note) {
 					notes += createFeedHTML(note);
 	 			})
				return notes
			})
			.then(notes => {
				return res.cookie('id', req.params.id).send(createUserHomeHTML(notes)); //keep eye on this
			})
			.catch(err => {
		  		console.log(err);
		  		res.status(500).json({errorMsg: "internal server error"});
			})
	},

	createNewUser: function (req, res) {
		//verify that each of the fields exist after verifying that the body is not empty.
		console.log('starting');
		if(!req.body) {
	 		res.status(400).json({errorMsg: "Your request is empty and invalid."})
		}
		console.log('still going');
		console.time();
		Object.keys(req.body).forEach(function(field) {
			let submittedValue = req.body[field];
			if(submittedValue === '') {
				return res.status(422).json({errorMsg: `Incorrect Length: ${field} is empty`});
			} 
			else if(typeof submittedValue !== 'string') {
				return res.status(422).json({errorMsg: `Incorrect datatype: ${field} is wrong field type`});	
			}
		})
		console.end()

		console.timeEnd();
		let {username, email, password, passwordConfirmation} = req.body

 		if(password !== passwordConfirmation) {
 			return res.status(422).json({errorMsg: `Passwords do not match.`})
 		}

		email = email.trim().toLowerCase(); 
		username = username.trim().toLowerCase();
		password = password.trim();
	
		//next check if user exists then create if it does not exist. 
		return User
				.find({username})
				.count()
				.exec()
				.then(count => {
					if(count>0) {
						return res.status(422).json({errorMsg: `This username already exists`});
					}
					return User.hashPassword(password)
				})
				.then(hash => {
					let newUser = new User ({
						email: email,
						username: username, 
						password: hash,
						userNotes: []
					});

					newUser.save(function(err, user) {
						if (err) {return console.log(err)};
						User
	   	 					.find(user.username)
	   	 					.exec()
	   	 					.then(res.status(201).send(renderHTMLAfterSignup()))
	   	 					.catch(err => {
	   	 						console.log(err);
	   	 						res.status(500).json({errorMsg: "internal server error"});
	   	 					})
					});
				})
				.catch(err => {
					console.log(err);
					res.status(500).json({errorMsg: 'internal server error'})
				})
		console.timeEnd();
	},

	getLogin: function (req, res) {
		try {
			return res.status(200).sendFile(__dirname + '/public/login.html');
		}
		catch (err) {
			console.log(err);
			return res.status(500).json({errMessage: "internal server error"});
		}
	},

	signout: function (req, res) {
		try {
				req.session.destroy(function (err) {
					res.clearCookie('id').send(renderHTMLAfterLogout()); //send body only for ajax call processing
				})
  		}
		catch (err) {
			console.log(err);
			return res.status(500).json({errMessage: "internal server error"});
		}
	}, 

	redirectHome: function (req, res) {
    	res.redirect('/user/' + req.user._id);
  	}
}

let noteController = {

	getNote: function (req, res) {
		Note
			.findById({"_id": req.params.noteId}, function(err, note) {
	 			if (err) {
	 				console.log(err)
	 				res.status(500).json({errorMsg: "internal server error"});
	 			};
	 			res.json(note.noteAPIRepr());
	 		})
			.exec()
	},

	deleteNote: function (req, res) {
		let note;
		Note
			.findByIdAndRemove(req.params.noteId, function(err, _note) {
				note = _note._id
				if(err) { 
					console.log(err);
					return res.status(500).json({errorMsg: "internal server error"}); 
				}
			})
			.exec()
			.then(function() {
				//remove the note ref object.
				User
					.findByIdAndUpdate(req.cookies.id, { $pull: {userNotes: note}})
					.exec()
					.then(res.status(204).end())
					.catch(err => {
						console.log(err)
						return res.status(500).json({errorMsg: "internal server error"})
					})
			})
	},

	updateNote: function (req, res) {
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
	},

	createNote: function (req, res) {
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
	}

}

module.exports = {userController, noteController};