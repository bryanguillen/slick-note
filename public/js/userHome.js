//client for user home!
//the following is mock code to get a structure for the project.
//LAYOUT INCLUDED BELOW

//State MGMT
var state = {};

//MOCK DATA!!
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

//DOM MANIPULATION
function getUserNotes() {
	var notes = ''
	for(var i=0, length=userNotes.notes.length; i<length; i++) {
		var note = userNotes.notes[i];
		notes += createNoteHTML(note);
	}
	return displayData(notes);
}

function createNoteHTML(note) {
	return  '<div><h1>' + 
				note.title + 
			'</h1><h6>' +
				note.subTitle + 
			'</h6>' +
			'<span>Delete Note</span></div>';
}

function displayData(notes) {
	$('div.notes-container').html(notes);
}

//EVENT LISTENERS

$(function() {
	getUserNotes();
})