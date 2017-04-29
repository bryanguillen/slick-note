//state mgmt
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

function renderFeed(notes) {
	$('main').html(notes);
}


function renderLogout(data) {
	$('body').html(data);
}

function renderNoteHomepage(html) {
	//landing page for all notes of the app.
	$('main').html(html);
}

function renderNote(header, note, noteId) {
	$('main').html(getNoteTemplate(header, note, noteId))
}


function renderSections(sections) {
	$('div.sections-container').append('<div class="sections">' + sections + '</div>' );
}

function renderSection(html) {
	$('main').html(html);
}

function renderNewSection(noteId) {
	$('main').html(getNewSectionTemplate(noteId));
}


function renderNewTitlesTemplate() {
	$('main').html(getNewTitlesTemplate());
}

function renderNewNoteTemplate(html) {
	$('main').html(html);
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
		var noteId = $(this).parent().prev().text(); 
		var settings = {
			type: 'GET',
			url: '/note/' + noteId,
			data: {
				"_id": noteId
			},
			dataType: "html",
			success: renderNoteHomepage //THE LANDING PAGE FOR ALL NOTES
		}
		return $.ajax(settings);
	})
}

function getAllSections() {
	$('main').on('click', '.sections-button', function(event) {
		event.preventDefault();
		var noteId = $('div.note-id').text();
		console.log(noteId);
		var settings = {
			type: 'GET',
			url: '/note/' + noteId + '/sections',
			dataType: 'html',
			success: renderSections
		}
		$(this).hide();
		$('span.hide-sections').show();
		return $.ajax(settings);
	})
}

function hideAllsections() {
	$('main').on('click', '.hide-sections', function(event) {
		event.preventDefault();
		$(this).hide();
		$('div.sections').remove();
		$('span.sections-button').show();
	})
}

function getSection() {
	$('main').on('click', '.note-section', function(event) {
		event.preventDefault();
		var sectionId = $(this).prev().text();
		noteId = $('div.note-id').text();
		var settings = {
		 	type: 'GET',
		 	url: '/note/' + noteId + '/section/' + sectionId,
		 	dataType: "html",
		 	success: renderSection
		}
		return $.ajax(settings);
	})
}

function getNewSection() {
	$('main').on('click', '.create-new-section', function(event) {
		event.preventDefault();
		var noteId = $('div.note-id').text();
		return renderNewSection(noteId);
	})
}

function clickNewNote() {
	$('nav').on('click', '.new-note-button', function(event) {
		event.preventDefault();
		return renderNewTitlesTemplate(); 
	});
}

function startNewNote() {
	$('main').on('click', '.start-notes', function(event) {
		//using event listener in order to not change the url to new note
		event.preventDefault();
		var title = $(this).parent().find('input[name="title"]').val();
		var subtitle = $(this).parent().find('input[name="subtitle"]').val();
		var settings = {
			type: 'POST',
			url: '/new-note',
			data: {
				"title": title,
				"subtitle": subtitle
			},
			dataType: 'html',
			success: renderNewNoteTemplate
		}
		return $.ajax(settings);
	})
}

function createNewNote() {
	$('main').on('click', '.create-note', function(event) {
		event.preventDefault();
		//temp solution for now for getting cookie value. 
		var newHeader = $(this).parent().parent().parent().find('div.header-value').find('input[name="header"]').val();
		var newNote = $(this).parent().prev().val();
		var noteId = $('div.note-id').text();
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
		var newHeader = $(this).parent().parent().parent().parent().prev().find('.header-container').find('.header').find('span.header-text').text()
		var noteId = $('div.note-id').text();
		var sectionId = $('div.section-id').text();

		if (noteText.trim().length === 0) {
					return $(this).parent().closest('div.note-container').find('.note-error-message').show();
		}
		
		var settings = {
		  	type: 'PUT',
		  	url: '/note/' + noteId,
		  	data: {
		  		"id": sectionId,
		  		"header": newHeader,
		  		"note": noteText 
		  	}	
		 }
		
		$(this).parent().prev().prev().hide();
		$('div.editing-note-container').hide();
		$('div.note').text(noteText).show();

		return $.ajax(settings);
	})
}

function updateTitle() {
	//updating the titles
	$('main').on('click', '.update-titles', function(event) {
		event.preventDefault();

		var noteId = $('div.note-id').text();

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

function updateHeader() {
	$('main').on('click', '.update-header', function(event) {
		event.preventDefault();
		var newHeader = $(this).prev().find('input[name="header"]').val();
		var noteText = $('div.note').text() || $('textarea.edit-note').val();
		var noteId = $('div.note-id').text();
		var sectionId = $('div.section-id').text();
		var settings = {
			type: 'PUT',
		 	url: '/note/' + noteId,
		 	data: {
		 		"id": sectionId,
		 		"header": newHeader,
		 		"note": noteText
		 	}
		}
		$('div.edit-header').hide();
		$('span.header-text').text(newHeader);
		$('div.header').show();
		return $.ajax(settings);
	})
}

function cancelTitleUpdate() {
	$('main').on('click', '.cancel-update', function(event) {
		event.preventDefault();
		var titleParent = $(this).parent();
		titleParent.hide();
		titleParent.prev().show();
	})
}

function cancelHeaderUpdate() {
	$('main').on('click', '.cancel-header', function(event) {
		event.preventDefault();
		$('div.edit-header').hide();
		$('div.header').show();
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
	hideAllsections();
	getSection();
	getNewSection();
	clickNewNote();
	startNewNote();
	createNewNote();
	updateTitle();
	updateNote();
	editNote();
	editTitle();
	editHeader();
	deleteNote();
	confirmDelete();
	updateHeader();
	cancelTitleUpdate();
	cancelHeaderUpdate();
})