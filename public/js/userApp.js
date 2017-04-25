//DOM MANIPULATION
function renderUserHome(data) {
	//get the contents within the main tag in 
	//the data and then just render that.. due to 
	//the way that the server side code was written.!
	//and how ajax processes the request. 
	let openMainTag = data.search('<main>') + 6;
	let closingMainTag = data.search('</main>');
	let noteFeedHTML = data.slice(openMainTag, closingMainTag);
	$('main').html(noteFeedHTML);
	
}

function renderLogout(data) {
	$('body').html(data);
}

function renderFeed(notes) {
	$('main').html(notes);
}

function renderNewNoteTemplate() {
	$('main').html(getNewTemplate());
}

function renderNoteTemplate(obj) {
	$('main').html(getNoteTemplate(obj.title, obj.subtitle, obj.id));
}

function renderPublishedNote(obj) {
	//here is where we get the template then render
	//renders note with editing mode hidden so the user could do as he/she pleases
	$('main').html(getPublishedNoteTemplate(obj.title, obj.subtitle, obj.notes, obj.id));
}

//EVENT LISTENERS
function getUserHome() {
	$('nav').on('click', '.home', function(event) {
		event.preventDefault();
		let userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		let settings = {
			type: 'GET',
			url: 'https://shielded-stream-62421.herokuapp.com/user/' + userId,
			dataType: 'html',
			success: renderUserHome
		}
		return $.ajax(settings);
	})
}

function getLogout() {
	$('nav').on('click', '.logout', function(event) {
		event.preventDefault();
		let settings = {
			type: 'GET',
			url: 'https://shielded-stream-62421.herokuapp.com/logout',
			dataType: 'html',
			success: renderLogout
		}
		return $.ajax(settings);
	})
}

function getUserNote() {
	$('main').on('click', '.view-note', function(event) {
		event.preventDefault();
		let userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		let noteId = $(this).closest('.user-note-container').find('div.note-id').text(); //keep eye on this
		let settings = {
			type: 'GET',
			url: 'https://shielded-stream-62421.herokuapp.com/note/' + noteId,
			data: {
				"_id": noteId
			},
			dataType: "json",
			success: renderPublishedNote //keep eye on this
		}
		return $.ajax(settings);
	})
}

function getNewNote() {
	$('nav').on('click', '.new-note-button', function(event) {
		event.preventDefault();
		return renderNewNoteTemplate(); //KEEP AN EYE ON THIS. 
	});
}

function createNewNote() {
	$('main').on('click', '.create-note', function(event) {
		event.preventDefault();
		//temp solution for now for getting cookie value. 
		let userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		let newTitle = $('input[type="text"][name="new-note-title"]').val();
		let newSubtitle = $('input[type="text"][name="new-note-subtitle"]').val();
		//adding empty strings for fresh note
		let settings = {
		 	type: 'POST',
		 	url: 'https://shielded-stream-62421.herokuapp.com/new-note',
		 	data: {
		 		"user": userId,
		 		"title": newTitle,
		 		"subtitle": newSubtitle,
		 		"notes": '' 
		 	},	 	
		 	success: renderNoteTemplate 
		}
		return $.ajax(settings);
	});
}

function updateNote() {
	//Two different sections because of design of app. 
	//You are either updating the titles, which wont be that often, 
	//or the note which is the core activity of the app.
	//therefore we split it, and focus more on the first event
	//listener of this function
	//willing to split these into two different functions completely.
	//but seems fair to say that updateNote includes the note and the 
	//titles for the notes.
	
	//updating the actual note
	$('main').on('click', 'button.save-note', function(event) {
		event.preventDefault();
		//ugly solutions for now for both noteText and noteId.
		let noteText = $(this).parent().closest('div.editing-note-container').find('textarea.edit-note').val();
		if (noteText.trim().length === 0) {
					return $(this).parent().closest('div.note-container').find('.note-error-message').show();
		}
		let noteId = $(this).parent().next().text();
		$(this).parent().closest('div.note-container').find('.note-error-message').hide();
		$('div.editing-note-container').hide();
		$('div.note').text(noteText).show();
		let settings = {
		 	type: 'PUT',
		 	url: 'https://shielded-stream-62421.herokuapp.com/note/' + noteId,
		 	data: {
		 		"notes": noteText
		 	}
		}
		return $.ajax(settings);
	})

	//updating the titles
	$('main').on('click', '.update-titles', function(event) {
		event.preventDefault();
		let titleParent = $(this).parent(); //CONSIDER RENAMING THIS VARIABLE
		let newTitle = titleParent.find('input[name="title"]').val();
		let newSubtitle = titleParent.find('input[name="subtitle"]').val(); 
		let noteId = titleParent.parent().find('div.note-id').text();
		
		if (newTitle.trim().length === 0 || newSubtitle.trim().length === 0) {
					return titleParent.find('div.error-message').show();
		}

		//consider putting the next two lines into a function?
		//set the title with new values in UI
		titleParent.prev().find('span.title-text').text(newTitle);
		titleParent.prev().find('span.subtitle-text').text(newSubtitle); 
		
		titleParent.hide();
		titleParent.prev().show();

		let settings = {
		  	type: 'PUT',
		  	url: 'https://shielded-stream-62421.herokuapp.com/note/' + noteId,
		  	data: {
		  		"title": newTitle,
		  		"subtitle": newSubtitle
		  	}	
		 }
		return $.ajax(settings);
	})

	$('main').on('click', '.cancel-title-update', function(event) {
		event.preventDefault();
		let titleParent =$(this).parent();
		titleParent.hide();
		titleParent.prev().show();
	})

}

function editNote() {
	$('main').on('click', '.note', function(event) {
		event.preventDefault();
		//FIRST GET THE TEXT OF THE DIV THEN HIDE IT
		let noteText = $(this).text();
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
		$('div.edit-title').show(); //can also just add a class in order to just render it hidden
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
		let userNoteContainer = $(this).closest('.user-note-container').hide(); //might make this into a function LIKE PARENT CONTAINER
		let noteId = $(this).closest('.user-note-container').find('.note-id').text();
	 	let settings = {
	 		type: 'DELETE',
	 		url: 'https://shielded-stream-62421.herokuapp.com/note/' + noteId
	 	}
	 	return $.ajax(settings);
	})	
}

$(function() {
	getUserHome();
	getLogout();
	getUserNote();
	getNewNote();
	createNewNote();
	updateNote();
	editNote();
	editTitle();
	deleteNote();
	confirmDelete();
})