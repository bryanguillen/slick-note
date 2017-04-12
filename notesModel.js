const mongoose = require('mongoose');

const notesSchema = mongoose.Schema({
	title: {type: String, required: true},
	subTitle: {type: String, required: true},
	sections: Array
});

notesSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		title: this.title,
		subTitle: this.subTitle,
		sections: this.sections
	}
}

const Note = mongoose.model('Note', notesSchema);

module.exports = {notesSchema};