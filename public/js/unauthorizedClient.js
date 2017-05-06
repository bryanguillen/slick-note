//State MGMT For Demo. 
state = {
	users: [
	{
		id: 200,
		username: 'demoUser123',
		userNotes: [
			{
				id: 1,
				title: 'Hello demoUser123',
				content: 'This is a ``demo`` feel free to read me, or edit me. Whatever you like'
			}, {
				id: 2,
				title: 'Learning Software Dev',
				content: 'Thus far, it has been an enjoyable journey. I mean ' +
						'It has been full of challenges but with ``the help of my mentor`` and supporting staff ' +
						'the journey has been a life changing experience.'
			}
		]
	}
	],
	notes: [
	{
		id: 1,
		user: 200,
		title: 'Hello World',
		content: 'This is a ``demo`` feel free to read me, or edit me. Whatever you like.'
	},
	{
		id: 2,
		user: 200,
		title: 'Learning Software Development',
		content: 'Thus far, it has been an enjoyable journey. I mean it has been full of challenges but with  ``the help of my mentor`` and supporting staff '
	}
	],

	dbIdSetter: 2
}

//Template to avoid calls to the server
//just handling unauthorized people in the client.
//DOM MANIPULATION
function renderLogout(data) {
	$('body').html(data);
}

function renderNewNoteTemp() {
	$('main').html(appTemplates.getNewNoteTemp());
}

function renderNoteTemp(noteObj) {
	$('main').html((appTemplates.getNoteTemp(noteObj.id, noteObj.title, noteFormattingServices.highlight(noteFormattingServices.noteFormatter(noteObj.content)))));
}

function renderEditTemp(noteObj) {
	$('main').html(appTemplates.getEditTemp(noteObj.id, noteObj.title, noteObj.content));
}

//EVENT LISTENERS

//start demo
function getDemoHome() {
	//return the json data..
	$('main').on('click', '.get-demo', function(event) {
		return appTemplates.getUserHome()
	})

	$('section').on('click', '.home', function(event) {
		return appTemplates.getUserHome();
	})
}


function demoNewNote() {
	$('section').on('click', 'a.demo-new-note', function(event) {
		event.preventDefault();
		return renderNewNoteTemp(); 
	});
}


function demoCreateNote() {
	$('main').on('click', '.create-note', function(event) {
		event.preventDefault();
		$('.note-error-message').hide();
		$('.highlighted-error').hide();
		var newTitle = $('#new-title').val();
		var newNoteText = $('#new-note').val();
		var formattedNoteStr = noteFormattingServices.noteFormatter(newNoteText);
		
		if (newTitle.trim().length === 0 || newNoteText.trim().length === 0) {
			return $('.note-error-message').show();
		}
		
		if(!noteFormattingServices.highlight(formattedNoteStr)) { //this line might cause bug
	 		return $('.highlighted-error').show()
	 	}

	 	state.dbIdSetter += 1
	 	
	 	var newNote = {
	 		id: state.dbIdSetter,
	 		user: 200,
	 		title: newTitle,
	 		content: newNoteText 
	 	}

	 	var userNoteRef = {
	 		id: state.dbIdSetter,
	 		title: newTitle,
	 		content: newNoteText
	 	}
	 	
	 	state.notes.push(newNote);
	 	state.users[0].userNotes.push(userNoteRef);
		
		for (var i=0; i<state.notes.length; i++) {
			if (state.notes[i].id === state.dbIdSetter) {
				return renderNoteTemp(state.notes[i]);
			}
		}
	
	});
}

function demoEditNote() {
	//clicking on both the edit note link as well as the div 
	//in the actual note. 
	$('main').on('click', 'a.edit', function(event) {
		event.preventDefault();
		var cardContentParent = $(this).closest('div.card-content'); //the parent 
		var noteId = cardContentParent.find('div.note-id').text(); 
		
		for (var i=0; i<state.notes.length; i++) {
			if (state.notes[i].id === parseInt(noteId)) {
				return renderEditTemp(state.notes[i]);
			}
		}
	})

	$('main').on('click', 'div.note', function(event) {
		event.preventDefault();
		var noteText = $(this).html();
		var removedHighlighterText = noteFormattingServices.removeHighlighter(noteText); //remove this for protecting textarea from nonsense
		var editorText = noteFormattingServices.editorFormatter(removedHighlighterText);//FOR THE text area! //TODO BETTER IMPLEMENTATION!
		$('#edit-note').val(editorText);
		$('div.editing-note-container').show();
		$('div.note').hide();  
	})

}

function demoUpdateNote() {
	$('main').on('click', 'button.save-note', function(event) {
		event.preventDefault();
		$('.note-error-message').hide();
		$('.highlighted-error').hide()
		var noteText = $('textarea').val();
		var noteId = $('div.note-id').text();
		var formattedNoteStr = noteFormattingServices.noteFormatter(noteText); //FOR THE NOTE DIV //TODO BETTER IMPLEMENTATION!
		if (noteText.trim().length === 0) {
			return $('.note-error-message').show();
		}	

	 	if(!noteFormattingServices.highlight(formattedNoteStr)) {
	 		return $('.highlighted-error').show()
	 	}

		$('div.editing-note-container').hide();
		$('div.note').html(noteFormattingServices.highlight(formattedNoteStr)).show();
		
		for (var i=0; i<state.notes.length; i++) {
			if (state.notes[i].id === parseInt(noteId)) {
				state.notes[i].content = noteText;
				state.users[0].userNotes[i].content = noteText;
			}
		}	
	
		return console.log('updated successfully');
	})
}

function demoEditTitle() {
	$('main').on('click', '.note-title', function(event) {
		event.preventDefault();  
		var noteTitle = $(this).text();
		$('div.note-title').hide();
		$('#edit-title').val(noteTitle);
		$('div.edit-title-container').show(); 
	})
}

function demoCancelTitleUpdate() {
	$('main').on('click', '#cancel-update', function(event) {
		event.preventDefault();
		$('.edit-title-container').hide();
		$('.note-title').show();
	})
}

function demoUpdateTitle() {
	//updating the titles
	$('main').on('click', '#update-title', function(event) {
		event.preventDefault();
		$('.emtpy-titles-error').hide();
		var noteId = $('div.note-id').text();

		var newTitle = $('#edit-title').val();
		//client side validation //test this!
		if (newTitle.trim() === 0) {
			return $('.emtpy-titles-error').show();;
		}

		for (var i=0; i<state.notes.length; i++) {
			if (state.notes[i].id === parseInt(noteId)) {
				state.notes[i].title = newTitle;
				state.users[0].userNotes[i].title = newTitle;
			}
		}
	})
}

function demoDeleteNote() {
	$('main').on('click', '.delete', function(event) {
		event.preventDefault();
		$(this).parent().next().show(); //traverse up and then down to the next p element containing the confirmation
	})
}

function demoConfirmDelete() {
	$('main').on('click', '.confirm-delete', function(event) {
		event.preventDefault();
		var noteId = $(this).closest('div.card-content').find('div.note-id').text();
		var userNoteContainer = $(this).closest('.user-note').hide(); 
	 	
	 	for (var i=0; i<state.notes.length; i++) {
			if (state.notes[i].id === parseInt(noteId)) {
				state.notes.splice(i, 1)
				state.users[0].userNotes.splice(i, 1)
			}
		}
	})	
}

function hideTip() {
	$('main').on('click', '.hide-tip', function(event) {
		event.preventDefault();
		$('.tips').hide();
	})
}

function renderLoginMarkup() {
	$('main').on('click', '.get-login', function(event) {
		event.preventDefault();
		return $('main').html(getLoginTemplate())
	})
}

function renderSignupMarkup() {
	$('main').on('click', '.get-signup', function(event) {
		event.preventDefault();
		return $('main').html(getSignupTemplate());
	})	
}
$(function() {
	getDemoHome();
	demoNewNote();
	demoCreateNote();
	demoEditNote();
	demoUpdateNote();
	demoEditTitle();
	demoCancelTitleUpdate();
	demoUpdateTitle();
	demoDeleteNote();
	demoConfirmDelete();
	hideTip();
	renderLoginMarkup();
	renderSignupMarkup();
})