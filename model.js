const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	createdAt: {type: Date, required: true},
	userNotes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Note'}]
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		username: this.username,
		userNotes: this.userNotes
	}
}

const noteSchema = mongoose.Schema({
	_user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	title: {type: String, required: true},
	subtitle: {type: String, required: true},
	notes: [
		{
			header: String,
			content:  String
		}
	]
})

noteSchema.methods.noteAPIRepr = function() {
	return {
		_user: this._user,
		title: this.title,
		subtitle: this.subtitle,
		notes: this.notes
	}
}

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

module.exports = {User, Note};