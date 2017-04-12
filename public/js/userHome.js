//State MGMT / API MGMT!
var state = {};

//DOM MANIPULATION
function displayUserData(obj) {
	//obj.username returns the username
	//right here we want to get just the title and subtitles for 
	//the user
	//that is going to be again obj.userNotes[i].title && ""
	//subtitle
	var notes = '';
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
	$('div.notes-container').html(notes);
}

//EVENT LISTENERS
function getUserData() {
	var currentCookie = document.cookie.split('=');
	//temp solution for now for getting cookie value. 
	var username = currentCookie[1];
	var user = {
		method: 'GET',
		url: 'http://localhost:8080/' + username + '.json',
		dataType: "json", 
		success: displayUserData
	}
	return $.ajax(user);
}

$(function() {
	getUserData();
})