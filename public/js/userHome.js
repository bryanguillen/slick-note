//client for user home!
//the following is mock code to get a structure for the project.
//LAYOUT INCLUDED BELOW

//State MGMT
var state = {};

//MOCK DATA!!
//DEV NOTE! DELETE AFTER DEVELOPMENT
//this object literal actually isn't that bad, considering
//using it for json file, adding the content that I need to add
var userNotes = {
	notes: [
		{
			title: "Title #1",
			subTitle: "sub-title #1"
		},
		{
			title: "Title #2",
			subTitle: "sub-title #2"
		},
		{
			title: "Title #3",
			subTitle: "sub-title #3"
		}
	]
} 

function getUserNotes() {
	var notes = ''
	for(var i=0, length=userNotes.notes.length; i<length; i++) {
		var note = userNotes.notes[i];
		notes += createNoteHTML(note);
	}
	return displayNotes(notes);
}

//DOM MANIPULATION
function createNoteHTML(note) {
	return  '<div><h1>' + 
				note.title + 
			'</h1><h6>' +
				note.subTitle + 
			'</h6>' +
			'<span>Delete Note</span></div>';
}

function displayNotes(notes) {
	$('div.notes-container').html(notes);
}

//EVENT LISTENERS

$(function() {
	getUserNotes();
})