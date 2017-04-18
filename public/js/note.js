//client for user NOTE!
//the following is mock code to get a structure for the project.
//LAYOUT INCLUDED BELOW

// function getCurrentNote() {
// 	//get current note from api in the future
// 	//for now just going to create and then display the note.
// 	var note = userNotes.notes[0];
// 	function createNoteHTML(note) {
// 		var html = '<div class="header">' + 
// 						note.sections[0].header + 
// 					'</div>' + 
// 					'<div class="content">' +
// 						note.sections[0].content + 
// 					'</div>'
// 		return displayCurrentNote(html);
// 	}
// 	return createNoteHTML(note);
// }

// function getSections() {
// 	//get the sections here to display on the side bar of current section
// 	//these are going to be clickable sections that the user can use to navigate
// 	var title = '<div>' + userNotes.notes[0].title + '</div>' + 
// 				'<div>' + userNotes.notes[0].subTitle + '</div>'

// 	var noteSections =  '<div>' + userNotes.notes[0].sections[0].header + '</div>'
// 	$('div.section-container').html(title + noteSections + 
// 		'<button class="close-sections js-close-sections"> << </button>'); 
// }

// //DOM MANIPULATION
// function displayCurrentNote(currentNote) {
// 	$('div.note').html(currentNote);
// }

// //EVENT LISTENERS
// function saveNote() {
// 	$('main').on('click', '.save-note', function(event) {
// 		event.preventDefault();
// 		//THIS IS WHERE IT WOULD BE SAVED TO THE DB AND PERSISTED
// 		//THEN, INSERT BACK TO DIV.NOTE IN ORDER TO BE EASILY READABLE
// 		var noteText = $('textarea.note').val();
// 		$('textarea.note').addClass('js-edit-note');
// 		$('button.save-note').addClass('js-save-note');
// 		$('div.note').text(noteText).removeClass('js-hide-note');
// 	})
// }

// function hideSections() {
// 	$('main').on('click', '.close-sections', function(event) {
// 		event.preventDefault();
// 		$(this).parent().removeClass('js-inline').addClass('js-hide-sections');
// 		$(this).closest('main').find('div.note-container').removeClass('js-inline');
// 		$(this).closest('main').find('button.show-section-button').removeClass('js-hide-section-button');
// 	})
// }

// function showSections() {
// 	$('main').on('click', '.show-section-button', function(event) {
// 		event.preventDefault();
// 		$(this).addClass('js-hide-section-button');
// 		$('div.section-container').addClass('js-inline').removeClass('js-hide-sections');
// 		$('div.note-container').addClass('js-inline');
// 		getSections();
// 	})
// }