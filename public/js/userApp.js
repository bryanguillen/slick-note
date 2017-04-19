//State MGMT / API MGMT!
var state = {};

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
	return  '<div class="user-note"><h1>' + 
				note.title + 
			'</h1><h6>' +
				note.subtitle + 
			'</h6></div>' +
			'<div><span class="delete-button">Delete Note</span></div>';
}

function renderFeed(notes) {
	$('main').html(notes);
}

function renderNewNote() {
	$('main').html(getNewTemplate());
}

function renderNoteTemplate(title, subtitle) {
	$('main').html(getNoteTemplate(title, subtitle));
}

//getting note template 
function createUserNoteHTML(obj) {
	//here is where we create the markeup.
	//temp solution! 
	$('main').html(getPublishedNoteTemplate(obj.title, obj.subtitle, obj.notes));
}

//EVENT LISTENERS
function getUserData() {
	var userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
	let settings = {
	 	type: 'GET',
	 	url: 'http://localhost:8080/' + userId + '.json',
	 	dataType: "json", 
	 	success: displayUserData
	}
	return $.ajax(settings);
}

function clickNewNote() {
	$('nav').on('click', '.new-note-button', function(event) {
		event.preventDefault();
		let settings = {
		type: 'GET',
		url: 'http://localhost:8080/new-note',
		dataType: "json", 
		success: renderNewNote
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
		 	success: renderNoteTemplate(newTitle, newSubtitle) 
		}
		return $.ajax(settings);
	});
}

function saveNote() {
	$('main').on('click', 'button.save-note', function(event) {
		event.preventDefault();
		let noteText = $('textarea.edit-note').val();
		let titleText = $(this).parent().prev().find('span.title-text').text();
		$('textarea.edit-note').addClass('js-hide-edit');
		$('button.save-note').addClass('js-hide-save');
		$('div.note').text(noteText).removeClass('js-hide-note');
		let settings = {
			type: 'PUT',
			url: 'http://localhost:8080/update-notes',
			data: {
				"title": titleText,
				"notes": noteText
			}
		}
		return $.ajax(settings);
	})
}

function editNote() {
	$('main').on('click', '.note', function(event) {
		event.preventDefault();
		//FIRST GET THE TEXT OF THE DIV
		let noteText = $(this).text();
		$('div.note').addClass("js-hide-note");
		//THEN, SET THE TEXT OF TEXTAREA TO THAT AND SHOW THE SAVE BUTTON!
		$('textarea.edit-note').append(noteText).removeClass("js-hide-edit");
		$('button.save-note').removeClass("js-hide-save");
	})	
}

function editTitle() {
	$('main').on('click', '.title', function(event) {
		event.preventDefault();
		//we want to hide this. well first get the text and then hide it. 
		//then we want to update the title once they press save. 
		let newTitle = $(this).find('span.title-text').text();
		let newSubtitle = $(this).find('span.subtitle-text').text();
		//after we grab that we have to then just allow the user to input something new.
		$('div.title').addClass('js-hide-title');
		$('div.edit-title').removeClass('js-edit-title-hide');
	})
}

function saveTitle() {
	$('main').on('click', '.update-titles', function(event) {
		event.preventDefault();
		//STRATEGY
		//allow user to edit the titles, and then when hit saves, 
		//grab those new values and insert them into their respective 
		//span tags in order to display without the input boxes. 
		let newTitle = $(this).parent().find('input[name="title"]').val();
		let newSubtitle = $(this).parent().find('input[name="subtitle"]').val(); 
		$(this).parent().addClass('js-edit-title-hide');
		$(this).parent().prev().find('span.title-text').text(newTitle);
		$(this).parent().prev().find('span.subtitle-text').text(newSubtitle);
		$(this).parent().prev().removeClass('js-hide-title');
		let settings = {
			type: 'PUT',
			url: 'http://localhost:8080/update-titles',
			data: {
				"title": newTitle,
				"subtitle": newSubtitle
			}
		}
		return $.ajax(settings);
	})
}

function getUserNote() {
	//on click what we are going to do is just render note template
	//when the user clicks on div.user-note what we want to do here is 
	//collect the text then render the noteTemplate with the titles as well 
	//any notes. 
	$('main').on('click', '.user-note', function(event) {
		event.preventDefault();
		let noteTitle = $(this).find('h1').text();
		let noteSubtitle = $(this).find('h6').text();
		let userId = document.cookie.replace(/(?:(?:^|.*;\s*)id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
		//what we need to do here, is find that and then 
		//we want to set a cookie with the id and then 
		//send a json with the information and just display with the proper template
		let settings = {
			type: 'GET',
			url: 'http://localhost:8080/note',
			data: {
				"user": userId,
				"title": noteTitle,
				"subtitle": noteSubtitle
			},
			dataType: "json",
			success: createUserNoteHTML
		}
		return $.ajax(settings);
	})
}

$(function() {
	getUserData();
	clickNewNote();
	createNewNote();
	saveNote();
	editNote();
	editTitle();
	saveTitle();
	getUserNote();
})