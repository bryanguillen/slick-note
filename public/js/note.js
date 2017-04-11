//client for user NOTE!
//the following is mock code to get a structure for the project.
//LAYOUT INCLUDED BELOW

//State MGMT
var state = {};

//MOCK DATA!!
var userNotes = {
	notes: [
		{
			header: "The Time Value Of Money",
			content: "The time value of money in the chapter\
						states that what is more valuable than \
						money is time. You can run out of money a hundred\
						times and still recover from that.\
						But if you lose time, you cannot recover from that."
		}
	]
}

function getCurrentNote() {
	//get current note from api in the future
	//for now just going to create and then display the note.
	var note = userNotes.notes[0];
	function createNoteHTML(note) {
		var html = '<div class="header">' + 
						note.header + 
					'</div>' + 
					'<div class="content">' +
						note.content + 
					'</div>'
		return displayCurrentNote(html);
	}
	return createNoteHTML(note);
}
//DOM MANIPULATION
function displayCurrentNote(currentNote) {
	$('div.note').html(currentNote);
}

//EVENT LISTENERS
function editCurrentNote() {
	$('main').on('click', '.note', function(event) {
		event.preventDefault();
		
		//FIRST GET THE TEXT OF THE DIV
		var text = $(this).find('div.content').text();
		$('div.note').addClass("js-note");

		//THEN, SET THE TEXT OF TEXTAREA TO THAT AND SHOW THE SAVE BUTTON!
		$('textarea.note').append(text);
		$('textarea.note').removeClass("js-edit-note");
		$('button.save-note').removeClass("js-save-note");
	})	
}

$(function() {
	getCurrentNote();
	editCurrentNote();
})