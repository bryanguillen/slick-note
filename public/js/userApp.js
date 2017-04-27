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

function renderNewTitlesTemplate() {
	$('main').html(getNewTitlesTemplate());
}

function renderNewNoteTemplate(obj) {
	$('main').html(getNoteTemplate(obj.id));
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
		var noteId = $(this).closest('.user-note-container').find('div.note-id').text(); //keep eye on this
		var settings = {
			type: 'GET',
			url: '/note/' + noteId,
			data: {
				"_id": noteId
			},
			dataType: "json",
			success: renderPublishedNote //keep eye on this
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
		var newHeader = $(this).closest('div.col-12').find('div.edit-header').find('input[name="header"]').val();
		var newNote = $(this).parent().prev().val();
		var noteId = $(this).parent().next().text();
		console.log(noteId);
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
		var noteText = $(this).parent().closest('div.editing-note-container').find('textarea.edit-note').val();
		
		if (noteText.trim().length === 0) {
					return $(this).parent().closest('div.note-container').find('.note-error-message').show();
		}
		var noteId = $(this).parent().next().text();
		
		$(this).parent().closest('div.note-container').find('.note-error-message').hide();
		$('div.editing-note-container').hide();
		$('div.note').text(noteText).show();
		
		var settings = {
		 	type: 'PUT',
		 	url: '/note/' + noteId,
		 	data: {
		 		"notes": noteText
		 	}
		}
		return $.ajax(settings);
	})

	//updating the titles
	$('main').on('click', '.update-titles', function(event) {
		event.preventDefault();
		
		//get values firsts
		var titleContainer = $(this).parent(); 
		var newTitle = titleContainer.find('input[name="title"]').val();
		var newSubtitle = titleContainer.find('input[name="subtitle"]').val();
		var noteId = titleContainer.parent().find('div.note-id').text();

		//client side validation
		if (newTitle.trim() === 0 || newSubtitle.trim() === 0) {
					return titleContainer.find('div.error-message').show();
		}

		//set the values
		titleContainer.prev().find('span.title-text').text(newTitle);
		titleContainer.prev().find('span.subtitle-text').text(newSubtitle); 
		titleContainer.hide();
		titleContainer.prev().show();

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

	$('main').on('click', '.cancel-title-update', function(event) {
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
	$('main').on('click', '.title', function(event) {
		event.preventDefault();  
		$('div.title').hide();
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
		var userNoteContainer = $(this).closest('.user-note-container').hide(); 
		var noteId = $(this).closest('.user-note-container').find('.note-id').text();
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
	clickNewNote();
	createNewNote();
	updateNote();
	editNote();
	editTitle();
	deleteNote();
	confirmDelete();
})