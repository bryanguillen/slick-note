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
	return  '<div><h1>' + 
				note.title + 
			'</h1><h6>' +
				note.subtitle + 
			'</h6>' +
			'<span>Delete Note</span></div>';
}

function renderFeed(notes) {
	$('main').html(notes);
}

function renderNewNote() {
	$('main').html(getNewTemplate());
}

function renderNoteTemplate() {
	$('main').html('<p>Hello world</p>');
}

//EVENT LISTENERS
function getUserData() {
	let currentCookie = document.cookie.split('='); 
	let userId = currentCookie[1]; //temp solution for getting cookie
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
		let currentCookie = document.cookie.split('=');
		//temp solution for now for getting cookie value. 
		let userId = currentCookie[1];
		let newTitle = $('input[type="text"][name="new-note-title"]').val();
		let newSubtitle = $('input[type="text"][name="new-note-subtitle"]').val();
		let settings = {
		 	type: 'POST',
		 	url: 'http://localhost:8080/new-note',
		 	data: {
		 		"user": userId,
		 		"title": newTitle,
		 		"subtitle": newSubtitle 
		 	},	 	
		 	dataType: "json", 
		 	success: renderNoteTemplate  
		 }
		 return $.ajax(settings);
	});
}

$(function() {
	getUserData();
	clickNewNote();
	createNewNote();
})