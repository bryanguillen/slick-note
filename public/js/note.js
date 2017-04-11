//client for user NOTE!
//the following is mock code to get a structure for the project.
//LAYOUT INCLUDED BELOW

//State MGMT
var state = {};

//MOCK DATA!!
var userNotes = {
	notes: [
		{
			title: "FINANCE THE TIME VALUE OF MONEY",
			subTitle: "FOR FINANCE 101",
			sections: [
					{
						header: "The Time Value Of Money",
						content: "The time value of money in the chapter " +
						"states that what is more valuable than " +
						"money is time. You can run out of money a hundred " +
						"times and still recover from that. " +
						"But if you lose time, you cannot recover from that."
					}
			]
		}
	]
}

function getCurrentNote() {
	//get current note from api in the future
	//for now just going to create and then display the note.
	var note = userNotes.notes[0];
	function createNoteHTML(note) {
		var html = '<div class="header">' + 
						note.sections[0].header + 
					'</div>' + 
					'<div class="content">' +
						note.sections[0].content + 
					'</div>'
		return displayCurrentNote(html);
	}
	return createNoteHTML(note);
}

function getSections() {
	//get the sections here to display on the side bar of current section
	//these are going to be clickable sections that the user can use to navigate
	var title = '<div>' + userNotes.notes[0].title + '</div>' + 
				'<div>' + userNotes.notes[0].subTitle + '</div>'

	var noteSections =  '<div>' + userNotes.notes[0].sections[0].header + '</div>'
	$('div.section-container').html(title + noteSections); 
}

//DOM MANIPULATION
function displayCurrentNote(currentNote) {
	$('div.note').html(currentNote);
}

//EVENT LISTENERS
function showSection() {
	$('main').on('click', '.show-section-button', function(event) {
		event.preventDefault();
		$(this).addClass('js-hide-section-button');
		$('div.section-container').addClass('js-inline').removeClass('js-hide-sections');
		$('div.note-container').addClass('js-inline');
		getSections();
	})
}

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
	showSection();
})