var domState = {
	noteIdentification: 0
}

//DOM MANIPULATION
function renderUserHome(data) { 
	//hack for endering user home through ajax call.
	var openMainTag = data.search('<main>') + 6;
	var closingMainTag = data.search('</main>');
	var noteFeedHTML = data.slice(openMainTag, closingMainTag);
	$('main').html(noteFeedHTML);
	
}

function renderLogout(data) {
	$('body').html(data);
}

function renderFeed(notes) {
	$('main').html(notes);
}

function renderNote(header, note, noteId) {
	$('main').html(getNoteTemplate(header, note, noteId))
}

function renderNoteHomepage(obj) {
	$('main').html(getNoteHomeTemplate(obj.title, obj.subtitle, obj.id));
}

function renderSections(sections) {
	$('div.sections').append(sections);
}

function renderSection(section) {
	var noteId = function() {
		return domState.noteIdentification
	}
	$('main').html(getNoteTemplate(section.header, section.note, noteId()));
}

function renderNewTitlesTemplate() {
	$('main').html(getNewTitlesTemplate());
}

function renderNewNoteTemplate(obj) {
	$('main').html(getNewNoteTemplate(obj.id));
}

function renderPublishedNote(obj) {
	$('main').html(getPublishedNoteTemplate(obj.title, obj.subtitle, obj.notes, obj.id));
}

//EVENT LISTENERS
function getUserHome() {
	//beware this get call. 
	$('nav').on('click', '.home', function(event) {
		event.preventDefault();
		var userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		var settings = {
			type: 'GET',
			url: '/user/' + userId,
			dataType: 'html',
			success: renderUserHome
		}
		return $.ajax(settings);
	})
}

function getLogout() {
	$('nav').on('click', '.logout', function(event) {
		event.preventDefault();
		var settings = {
			type: 'GET',
			url: '/logout',
			dataType: 'html',
			success: renderLogout
		}
		return $.ajax(settings);
	})
}

function getUserNote() {
	$('main').on('click', '.view-note', function(event) {
		event.preventDefault();
		var userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		var noteId = $(this).parent().prev().text(); //keep eye on this
		var settings = {
			type: 'GET',
			url: '/note/' + noteId,
			data: {
				"_id": noteId
			},
			dataType: "json",
			success: renderNoteHomepage //keep eye on this
		}
		return $.ajax(settings);
	})
}

function getAllSections() {
	$('main').on('click', '.sections-button', function(event) {
		event.preventDefault();
		var noteId = $(this).next().text();
		var settings = {
			type: 'GET',
			url: '/note/' + noteId + '/sections',
			dataType: 'html',
			success: renderSections
		}
		return $.ajax(settings);
	})
}

function getNoteSection() {
	$('main').on('click', '.note-section', function(event) {
		event.preventDefault();
		var sectionId = $(this).prev().text();
		var noteId = $(this).parent().prev().text();
		domState.noteIdentification = noteId;
		var settings = {
			type: 'GET',
			url: '/note/' + noteId + '/section/' + sectionId,
			dataType: "json",
			success: renderSection
		}
		return $.ajax(settings);
	})
}

function clickNewNote() {
	$('nav').on('click', '.new-note-button', function(event) {
		event.preventDefault();
		return renderNewTitlesTemplate(); 
	});
}

function createNewNote() {
	$('main').on('click', '.create-note', function(event) {
		event.preventDefault();
		//temp solution for now for getting cookie value. 
		var userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		var newHeader = $(this).parent().parent().parent().find('div.header-value').find('input[name="header"]').val();
		var newNote = $(this).parent().prev().val();
		var noteId = $(this).parent().next().text();
		var settings = {
			type: 'POST',
			url: '/note/' + noteId,
			data: {
				"header": newHeader,
				"note": newNote
			},
			success: renderNote(newHeader, newNote, noteId)
		}
		return $.ajax(settings);
	});
}

function updateNote() {
	//updating the actual note
	$('main').on('click', 'button.save-note', function(event) {
		event.preventDefault();
		
		//ugly solutions for now for both noteText and noteId.
		var noteText = $(this).parent().prev().val();
		var header = $(this).parent().parent().parent().parent().prev().find('.header-container').find('.header').find('span.header-text').text()
		var noteId = $(this).parent().next().text();

		if (noteText.trim().length === 0) {
					return $(this).parent().closest('div.note-container').find('.note-error-message').show();
		}
		
		$(this).parent().prev().prev().hide();
		$('div.editing-note-container').hide();
		$('div.note').text(noteText).show();
		
		var settings = {
		 	type: 'PUT',
		 	url: '/note/' + noteId,
		 	data: {
		 		"header": header,
		 		"note": noteText
		 	}
		}
		return $.ajax(settings);
	})
}

function updateTitle() {
	//updating the titles
	$('main').on('click', '.update-titles', function(event) {
		event.preventDefault();

		var noteId = $(this).next().next().text();
		var newTitle = $(this).prev().find('input[name="title"]').val();
		var newSubtitle = $(this).prev().find('input[name="subtitle"]').val();
		var editTitlesParent = $(this).parent();

		//client side validation
		if (newTitle.trim() === 0 || newSubtitle.trim() === 0) {
					return titleContainer.find('div.error-message').show();
		}

		//set the values
		editTitlesParent.prev().find('span.title-text').text(newTitle);
		editTitlesParent.prev().find('span.subtitle-text').text(newSubtitle); 
		editTitlesParent.hide();
		editTitlesParent.prev().show();

		var settings = {
		  	type: 'PUT',
		  	url: '/note/' + noteId,
		  	data: {
		  		"title": newTitle,
		  		"subtitle": newSubtitle
		  	}	
		 }
		return $.ajax(settings);
	})
}

function clickCancelUpdate() {
	$('main').on('click', '.cancel-update', function(event) {
		event.preventDefault();
		var titleParent =$(this).parent();
		titleParent.hide();
		titleParent.prev().show();
	})
}

function editNote() {
	$('main').on('click', '.note', function(event) {
		event.preventDefault();
		//FIRST GET THE TEXT OF THE DIV THEN HIDE IT
		var noteText = $(this).text();
		$('div.note').hide();
		//THEN, SET THE TEXT OF TEXTAREA TO THAT AND SHOW THE SAVE BUTTON!
		$('textarea.edit-note').append(noteText);
		$('div.editing-note-container').show();
	})	
}

function editTitle() {
	$('main').on('click', '.titles', function(event) {
		event.preventDefault();  
		$('div.titles').hide();
		$('div.edit-title').show(); 
	})
}

function editHeader() {
	$('main').on('click', '.header', function(event) {
		event.preventDefault();  
		$('div.header').hide();
		$('div.edit-header').show();	
	})
}


function deleteNote() {
	$('main').on('click', '.delete-button', function(event) {
		event.preventDefault();
		$(this).nextAll().show();
	})
}

function confirmDelete() {
	$('main').on('click', '.confirm-delete-button', function(event) {
		event.preventDefault();
		var userNoteContainer = $(this).closest('.user-note-container').hide(); 
		var noteId = $(this).prev().prev().prev().text();
	 	var settings = {
	 		type: 'DELETE',
	 		url: '/note/' + noteId
	 	}
	 	return $.ajax(settings);
	})	
}

$(function() {
	getUserHome();
	getLogout();
	getUserNote();
	getAllSections();
	getNoteSection();
	clickNewNote();
	createNewNote();
	updateTitle();
	updateNote();
	editNote();
	editTitle();
	editHeader();
	deleteNote();
	confirmDelete();
})