//imports
const {User, Note} = require('./model');
const {services} = require('./services');

let userController = {
	
	getHomePage: function (req, res) {
		User
			.findById(req.params.id)//req.user._id for passport later
			.populate('userNotes')
			.exec() 
			.then(user => user.apiRepr())
			.then(function(json) {
				let notes = '';
				json.userNotes.forEach(function(note) {
 					notes += services.getUserFeedMarkup(note);
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
	 		res.status(400).json({errorMsg: "Your request is empty and invalid."})
		}
	
		Object.keys(req.body).forEach(function(field) {
			let submittedValue = req.body[field];
			if(submittedValue === '') {
				return res.status(422).json({errorMsg: `Incorrect Length: ${field} is empty`});
			} 
			else if(typeof submittedValue !== 'string') {
				return res.status(422).json({errorMsg: `Incorrect datatype: ${field} is wrong field type`});	
			}
		})
		
		let {username, email, password, passwordConfirmation} = req.body;

 		if(password !== passwordConfirmation) {
 			return res.status(422).json({errorMsg: `Passwords do not match.`})
 		}

		email = email.trim().toLowerCase(); 
		username = username.trim().toLowerCase();
		password = password.trim();
	
		// //next check if user exists then create if it does not exist. 
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
	   	 					.then(res.status(201).send(services.getLoginMarkup()))
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
		
	},

	//this is for passport as well.
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

	//controller for passport
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

	//work with creating and updating the notes with the new schema
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
		let newNote = new Note ({
			"user": req.body.user,
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

	createNoteSection: function(req, res) {
		let newNoteSection = {
			"header": req.body.header,
			"note": req.body.note
		}
	
		Note
			.findByIdAndUpdate(req.params.noteId, { $push: {notes: newNoteSection}})
			.exec()
			.then(note => {
				res.status(201).json(note.noteAPIRepr())
			})
			.catch(err => {
				console.log(err);
				res.status(500).json({errorMsg: "internal server error"});
			})
	}

}

module.exports = {userController, noteController};