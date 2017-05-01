//imports
const {User, Note} = require('./model');
const {services} = require('./services');

let userController = {
	
	getHomePage: function (req, res) {
		User
			.findById(req.params.id)//req.user._id for passport later
			.populate('userNotes')
			.exec(function(err, user) {
				if (err) {
					console.log(err);
					return res.status(500).json({errMessage: "internal server error"})
				}

				if(!user) {
					return res.json({errorMsg: 'oops, user not found!'});
				}
				
				return user;
			}) 
			.then(function(json) {
				let notes = '';
				json.userNotes.forEach(function(note) {
 					notes += services.createUserFeedMarkup(note);
 	 			})
				return notes
			})
			.then(notes => {
				return res.cookie('id', req.params.id).status(200).send(services.getUserHomeMarkup(notes)); //just setting cookie for now.
			})
			.catch(err => {
		  		console.log(err);
		  		res.status(500).json({errorMsg: "internal server error"});
			})
	},

	createNewUser: function (req, res) {
		//verify that each of the fields exist after verifying that the body is not empty.
		if(!req.body) {
	 		return res.status(400).json({errorMsg: "Your request is empty and invalid."})
		}
	
		Object.keys(req.body).forEach(function(field) {
			let submittedValue = req.body[field];
			if(submittedValue.trim() === '') {
				return res.status(422).send(services.displaySignupError('Incorrect Length:' + field + ' is empty'));
			} 
			else if(typeof submittedValue !== 'string') {
				return res.status(422).send(services.displaySignupError('Incorrect datatype: ' + field + ' is wrong field type'));	
			}
		})
		
		let {username, email, password, passwordConfirmation} = req.body;

 		if(password !== passwordConfirmation) {
 			return res.status(422).send(services.displaySignupError('passwords do not match'));
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
						throw newres.status(422).send(services.displaySignupError('username already exists'));
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
	   	 					.then(res.status(201).send(services.getLoginMarkup('you have logged in successfully')))
	   	 					.catch(err => {
	   	 						console.log(err);
	   	 						res.status(500).json({errorMsg: "internal server error"});
	   	 					})
					});
				})
	},

	//this is for passport as well.
	signout: function (req, res) {
		try {
				req.session.destroy(function (err) {
					res.clearCookie('id').send(services.getLoginMarkup('you have signed out successfully')); //this is subject to change 
				})
  		}
		catch (err) {
			console.log(err);
			return res.status(500).json({errMessage: "internal server error"});
		}
	}, 

	//controller for passport
	redirectHome: function (req, res) {
    	res.redirect('/user/' + req.user._id);
  	}, 

  	getLogin: function (req, res) {
		res.send(services.getLoginMarkup('login page'))
  	},

  	failedLogin: function (req, res) {
  		res.send(services.getLoginMarkup('invalid username/password'));
  	}
}

let noteController = {

	getNote: function (req, res) {
		Note
			.findById({"_id": req.params.noteId})
			.exec(function(err, note) {
	 				if (err) {
	 					console.log(err)
	 					res.status(500).json({errorMsg: "internal server error"});
	 				};

	 				if(!note) {
	 					console.log('no user found here');
	 					return json({errMessage: "no user found here"});
	 				}
	 				
	 				return note
	 		})
	 		.then(note => {
	 			return res.status(200).json(note.noteAPIRepr());
	 		})
	 		.catch(err => {
	 			console.log(err);
	 			return res.json({errMessage: "internal server error"});
	 		})
	},

	getSections: function(req, res) {
		Note
			.findById(req.params.noteId)
			.exec()
			.then(note => {
				return res.status(200).json(note.noteAPIRepr());
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({errorMsg: "internal server error"});
			})
	},

	getSection: function(req, res) {
		Note
			.findById(req.params.noteId)
			.exec()
			.then(note => {
				for (let i=0; i<note.notes.length; i++) {
					if (note.notes[i].id === req.params.sectionId) {
						return res.status(200).json({id: note.id, note: note.notes[i]}); 
					}
				}
			})
			.catch(err => {
				console.log(err);
				return res.status(500).json({errMessage: "hello world!"});
			})
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

	//work with creating and updating the notes with the new schema
	updateNote: function (req, res) {
		let updatedFields = {};
		let newValues = { $set: updatedFields}

		Object.keys(req.body).forEach(function(field) {
			//leave id out of the update 
			if (field !== "id") {
				updatedFields[field] = req.body[field];
			}
		})
		
		//update the sections
		if ("header" in updatedFields && "note" in updatedFields) {
			Note
				.findById(req.params.noteId)
				.exec()
				.then(userNote => {
					for (let i=0, length=userNote.notes.length; i<length;  i++) {
						if (userNote.notes[i].id === req.body.id) {
							userNote.notes[i].header = req.body.header;
							userNote.notes[i].note = req.body.note;
							
							userNote.save(function (err, updatedNote) {
    							if (err) {
    								console.log(err);
    							}
    							res.status(204).end();
  							});
						}
					}
				})
				.catch(err => res.send(err))
		}
		
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
	
	startNote: function (req, res) {
		//start note consists of just writing the 
		//the titles for the note. so it is sort of the setup for the note. 
		let newNote = new Note ({
			"user": req.cookies.id, //use for now
			"title": req.body.title, 
			"subtitle": req.body.subtitle
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
	}, 

	createNote: function(req, res) {
		let newNoteSection = {
			"header": req.body.header,
			"note": req.body.note
		}
	
		Note
			.findByIdAndUpdate(req.params.noteId, { $push: {notes: newNoteSection}})
			.exec()
			.then(userNote => {
				return Note.findOne({'notes.header': req.body.header, 'notes.note': req.body.note});
			})
			.then(updatedNote => {
				for (let i=0, length=updatedNote.notes.length; i<length;  i++) {
					if (updatedNote.notes[i].note === req.body.note) {
						res.status(201).json({id: req.params.noteId, theNote: updatedNote.notes[i]})
					}
				}
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({errorMsg: "internal server error"});
			})
	}

}

module.exports = {userController, noteController};