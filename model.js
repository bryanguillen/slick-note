const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	userNotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}]
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		username: this.username,
		userNotes: this.userNotes
	}
}

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const noteSchema = mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	title: { type: String, required: true },
	content: { type: String, required: true }
})

noteSchema.methods.noteAPIRepr = function() {
	return {
		id: this._id,
		user: this.user,
		title: this.title,
		content: this.content
	}
}

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

module.exports = {User, Note};