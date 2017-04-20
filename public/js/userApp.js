//DOM MANIPULATION
function displayUserData(obj) {
	//obj.username returns the username
	//right here we want to get just the title and subtitles for 
	//the user
	//that is going to be again obj.userNotes[i].title && ""
	//subtitle
	if (obj.userNotes.length >= 1) {
		let notes = '';
		obj.userNotes.forEach(function(item) {
			notes += createFeedHTML(item);
	 	})
		return renderFeed(notes);
	}
	return renderFeed('');
}

function createFeedHTML(note) {
	//notes will display like facebook's 
	//feed feature with just the title and subtitle
	//of the post 
	return  '<div class="user-note-container">' + 
				'<div class="note-id">' + note._id + '</div>' +
				'<div class="user-note">' + 
					'<h1>' + note.title + '</h1>' + 
					'<h6>' + note.subtitle + '</h6>' + 
				'</div>' +
				'<div class="delete-container">' + 
					'<span class="delete-button">Delete Note</span>' + 
					'<span class="confirm-delete">Are you sure</span>' + 
					'<span class="confirm-delete confirm-delete-button">Yes</span>' + 
				'</div>' +
			'</div>'; 
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
function getUserData() {
	let userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1"); //temp solution
	let settings = {
	 	type: 'GET',
		url: 'http://localhost:8080/user/' + userId + '.json',
	 	dataType: "json", 
	 	success: displayUserData
	}
	return $.ajax(settings);
}

function getUserNote() {
	$('main').on('click', '.user-note', function(event) {
		event.preventDefault();
		let userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		let noteId = $(this).closest('.user-note-container').find('div.note-id').text(); //keep eye on this
		let settings = {
			type: 'GET',
			url: 'http://localhost:8080/note/' + noteId,
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
		let settings = {
		type: 'GET',
		url: 'http://localhost:8080/new-note',
		dataType: "json", 
		success: renderNewNoteTemplate
		}
		return $.ajax(settings);
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
		 	url: 'http://localhost:8080/new-note',
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
		let noteText = $('textarea.edit-note').val();
		let noteId = $(this).next().text();
		$('div.editing-note-container').hide();
		$('div.note').text(noteText).show();
		let settings = {
		 	type: 'PUT',
		 	url: 'http://localhost:8080/note/' + noteId,
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
		let noteId = titleParent.parent().next().find('div.note-id').text();

		//consider putting the next two lines into a function?
		//set the title with new values in UI
		titleParent.prev().find('span.title-text').text(newTitle);
		titleParent.prev().find('span.subtitle-text').text(newSubtitle); 
		
		$(this).parent().hide();
		titleParent.prev().show();
		
		let settings = {
		  	type: 'PUT',
		  	url: 'http://localhost:8080/note/' + noteId,
		  	data: {
		  		"title": newTitle,
		  		"subtitle": newSubtitle
		  	}
		 }
		return $.ajax(settings);
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
	 		url: 'http://localhost:8080/note/' + noteId
	 	}
	 	return $.ajax(settings);
	})	
}

$(function() {
	//recently changed names, might cause bug. be on the lookout. 
	getUserData();
	getUserNote();
	getNewNote();
	createNewNote();
	updateNote();
	editNote();
	editTitle();
	deleteNote();
	confirmDelete();
})