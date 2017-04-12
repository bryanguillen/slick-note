//State MGMT / API MGMT!
var state = {};


function displayUserData(obj) {
	var notes = '';
	obj.note.forEach(function(item) {
		notes += createNoteHTML(item);
	})
	return displayNotes(notes);
}

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


//DOM MANIPULATION
function createNoteHTML(note) {
	return  '<div><h1>' + 
				note.title + 
			'</h1><h6>' +
				note.subTitle + 
			'</h6>' +
			'<span>Delete Note</span></div>';
}

function displayNotes(notes) {
	$('div.notes-container').html(notes);
}

//EVENT LISTENERS

$(function() {
	getUserData();
})