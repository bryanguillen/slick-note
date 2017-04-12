const mongoose = require('mongoose');

//SCHEMA for how the user json will look
const userSchema = mongoose.Schema({
	username: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	createdAt: {type: Date, required: true},
	notes: Array
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		username: this.username,
		notes: this.notes
	}
}

const User = mongoose.model('User', userSchema);

module.exports = {User};