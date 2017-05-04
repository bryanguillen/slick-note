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

function renderEditTemp(noteObj) {
	$('main').html(appTemplates.getEditTemp(noteObj.id, noteObj.title, noteObj.content));
}

function renderNewNoteTemplate(note) {
	$('main').html(appTemplates.getNewNoteTemp(note.id));
}


function getUserHome() {
	//beware this get call. 
	$('nav').on('click', '.home', function(event) {
		event.preventDefault();
		console.log('hello world!');
		// var userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		// var settings = {
		// 	type: 'GET',
		// 	url: '/user/' + userId,
		// 	dataType: 'html',
		// 	success: renderUserHome
		// }
		// return $.ajax(settings);
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

function clickNewNote() {
	$('nav').on('click', '.new-note-button', function(event) {
		event.preventDefault();
		return renderNewTitlesTemplate(); 
	});
}

function editNote() {
	$('main').on('click', 'a.edit', function(event) {
		event.preventDefault();
		var cardContentParent = $(this).closest('div.card-content'); //the parent 
		var noteId = cardContentParent.find('div.note-id').text(); 
		var settings = {
			type: 'GET',
			url: '/note/' + noteId,
			dataType: "json",
			success: renderEditTemp //THE LANDING PAGE FOR ALL NOTES
		}
		return $.ajax(settings);
	})
}

function startNewNote() {
	$('main').on('click', '.start-notes', function(event) {
		//using event listener in order to not change the url to new note
		event.preventDefault();
		$('.emtpy-titles-error').hide();
		var title = $(this).parent().find('input[name="title"]').val();
		var subtitle = $(this).parent().find('input[name="subtitle"]').val();
		var settings = {
			type: 'POST',
			url: '/new-note',
			data: {
				"title": title,
				"subtitle": subtitle
			},
			dataType: 'json',
			success: renderNewNoteTemplate
		}

		if (title.trim().length === 0 || subtitle.trim().length === 0) {
			return $('.emtpy-titles-error').show();
		}
		return $.ajax(settings);
	})
}

function createNewNote() {
	$('main').on('click', '.create-note', function(event) {
		event.preventDefault();
		$('.emtpy-titles-error').hide();
		var newHeader = $(this).parent().parent().parent().find('div.header-value').find('input[name="header"]').val();
		var newNoteText = $(this).parent().prev().val();
		var noteId = $('div.note-id').text();
		var settings = {
			type: 'POST',
			url: '/note/' + noteId,
			data: {
				"header": newHeader,
				"note": newNoteText
			},
			success: renderNote
		}
	
		if (newHeader.trim().length === 0 || newNoteText.trim().length === 0) {
			return $('.emtpy-titles-error').show();
		}
		else {
			return $.ajax(settings);
		}
	});
}

function updateNote() {
	//updating the actual note
	$('main').on('click', 'button.save-note', function(event) {
		event.preventDefault();
		$('.emtpy-titles-error').hide();
		//ugly solutions for now for both noteText and noteId.
		var noteText = $(this).parent().prev().val();
		var newHeader = $(this).parent().parent().parent().parent().prev().find('.header-container').find('.header').find('span.header-text').text()
		var noteId = $('div.note-id').text();
		var sectionId = $('div.section-id').text();

		if (noteText.trim().length === 0) {
			return $('.emtpy-titles-error').show();
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
		$('.emtpy-titles-error').hide();
		var noteId = $('div.note-id').text();

		var newTitle = $(this).prev().find('input[name="title"]').val();
		var newSubtitle = $(this).prev().find('input[name="subtitle"]').val();
		var editTitlesParent = $(this).parent();

		//client side validation
		if (newTitle.trim() === 0 || newSubtitle.trim() === 0) {
			return $('.emtpy-titles-error').show();;
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

function cancelTitleUpdate() {
	$('main').on('click', '.cancel-update', function(event) {
		event.preventDefault();
		var titleParent = $(this).parent();
		titleParent.hide();
		titleParent.prev().show();
	})
}

function editTitle() {
	$('main').on('click', '.titles', function(event) {
		event.preventDefault();  
		$('div.titles').hide();
		$('div.edit-title').show(); 
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
		var noteId = $(this).prev().prev().prev().text();
		var userNoteContainer = $(this).closest('.user-note-container').hide(); 
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
	editNote();
	startNewNote();
	createNewNote();
	updateNote();
	updateTitle();
	cancelTitleUpdate();
	editTitle();
	deleteNote();
	confirmDelete();
})