//State MGMT / API MGMT!
var state = {};

//DOM MANIPULATION
function displayUserData(obj) {
	//obj.username returns the username
	//right here we want to get just the title and subtitles for 
	//the user
	//that is going to be again obj.userNotes[i].title && ""
	//subtitle
	let notes = '';
	obj.userNotes.forEach(function(item) {
		notes += createFeedHTML(item);
	 })
	return renderFeed(notes);
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
	$('main').html();
}

//EVENT LISTENERS
function getUserData() {
	let currentCookie = document.cookie.split('=');
	//temp solution for now for getting cookie value. 
	let userId = currentCookie[1];
	let currentUser = {
		method: 'GET',
		url: 'http://localhost:8080/' + userId + '.json',
		dataType: "json", 
		success: displayUserData
	}
	return $.ajax(currentUser);
}

function clickNewNote() {
	$('nav').on('click', '.new-note-button', function(event) {
		event.preventDefault();
		let currentUser = {
		method: 'GET',
		url: 'http://localhost:8080/new-note',
		dataType: "json", 
		success: renderNewNote
		}
		return $.ajax(currentUser);
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
		let currentUser = {
		 	method: 'POST',
		 	url: 'http://localhost:8080/new-note',
		 	data: {
		 		"user": userId,
		 		"title": newTitle,
		 		"subtitle": newSubtitle 
		 	},	 	
		 	dataType: "json", 
		 	success: renderNoteTemplate  
		 }
		 return $.ajax(currentUser);
	});
}

$(function() {
	getUserData();
	clickNewNote();
	createNewNote();
})