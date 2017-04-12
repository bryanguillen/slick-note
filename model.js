const mongoose = require('mongoose');

//SCHEMA for how the user json will look
//just include the notes here, why not!
const userSchema = mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	createdAt: {type: Date, required: true},
	userNotes: [
		{
			title: {type: String, required: true},
			subtitle: {type: String, required: true},
			notes: Array
		}
	]
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		username: this.username,
		userNotes: this.userNotes
	}
}

const User = mongoose.model('User', userSchema);

module.exports = {User};