//INPUT MANIPULATION 
//LACK OF A BETTER NAME FOR THE 
//FUNCTIONS! RENAME ASAP!
//SIMPLE IMPLEMENTATIONS FOR 
//PROTOTYPE
function noteFormatter(string) {
	var lineBreak = '<br>';
	var brString = string.replace(/\n/g, lineBreak);
	function spaceRecognizer(brString) {
		var nbSpace = '&nbsp;';
		var fullyFormattedStr = brString.replace(/\s/g, nbSpace);
		return fullyFormattedStr;
	}
	return spaceRecognizer(brString);
}

function editorFormatter(string) {
	var lineBreak = '\n';
	var brString = string.replace(/<br>/g, lineBreak);
	function spaceRecognizer(brString) {
		var editorSpace = ' ';
		var formattedEditor = brString.replace(/&nbsp;/g, editorSpace);
		return formattedEditor;
	}
	return spaceRecognizer(brString);
}

function highlighter(string) {
	//add yellow highlighting when two tick marks are encloessed by anothed
	//two tick marks
	var stringCharacters = string.split('');
	var tick = '`';
	var tickCounter = 0;
	var tickIndices = [];
	for (var i=0, length=stringCharacters.length; i<length; i++) {
		var currentCharacter = stringCharacters[i];
		var nextCharacter = stringCharacters[i+1];
		if (currentCharacter===tick && nextCharacter===tick) {
			tickCounter += 1;
			if (tickCounter % 2 !== 0) {
				stringCharacters.splice(i, 1, '<span class="highlighted">')
				stringCharacters.splice(i+1, 1);
				tickIndices.push(i);
			}
			else { 
				stringCharacters.splice(i, 1, '</span>')
				stringCharacters.splice(i+1, 1);
				tickIndices.push(i);
			} 
		}
	}
	return stringCharacters.join('');
}

function removeHighlighter(string) {
	var removeOpeningTags = string.replace(/<span class="highlighted">/g, '``');
	function removeClosingTags(string) {
		var textString = string.replace(/<\/span>/g, '``');
		return textString;
	}
	return removeClosingTags(removeOpeningTags);
}

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

function renderNewNoteTemp() {
	$('main').html(appTemplates.getNewNoteTemp());
}

function renderNoteTemp(noteObj) {
	$('main').html(appTemplates.getNoteTemp(noteObj.id, noteObj.title, highlighter(noteFormatter(noteObj.content))));
}

function renderEditTemp(noteObj) {
	$('main').html(appTemplates.getEditTemp(noteObj.id, noteObj.title, noteObj.content));
}

//EVENT LISTENERS
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
		return renderNewNoteTemp(); 
	});
}

function createNewNote() {
	$('main').on('click', '.create-note', function(event) {
		event.preventDefault();
		$('.emtpy-titles-error').hide();
		var newTitle = $('#new-title').val();
		var newNoteText = $('#new-note').val();
		var settings = {
			type: 'POST',
			url: '/new-note',
			data: {
				"title": newTitle,
				"content": newNoteText
			},
			dataType: 'json',
			success: renderNoteTemp
		}
	
		if (newTitle.trim().length === 0 || newNoteText.trim().length === 0) {
			return $('.emtpy-titles-error').show();
		}
		
		return $.ajax(settings);
	});
}

function editNote() {
	//clicking on both the edit note link as well as the div 
	//in the actual note. 
	$('main').on('click', 'a.edit', function(event) {
		event.preventDefault();
		var cardContentParent = $(this).closest('div.card-content'); //the parent 
		var noteId = cardContentParent.find('div.note-id').text(); 
		var settings = {
			type: 'GET',
			url: '/note/' + noteId,
			dataType: "json",
			success: renderEditTemp 
		}
		return $.ajax(settings);
	})

	$('main').on('click', 'div.note', function(event) {
		event.preventDefault();
		var noteText = $(this).html();
		var removedHighlighterText =removeHighlighter(noteText); //remove this for protecting textarea from nonsense
		var editorText = editorFormatter(removedHighlighterText);//FOR THE text area! //TODO BETTER IMPLEMENTATION!
		$('#edit-note').val(editorText);
		$('div.editing-note-container').show();
		$('div.note').hide();  
	})

}

function updateNote() {
	$('main').on('click', 'button.save-note', function(event) {
		event.preventDefault();
		$('.emtpy-titles-error').hide();

		var noteText = $('textarea').val();
		var noteId = $('div.note-id').text();
		var formattedNoteStr = noteFormatter(noteText); //FOR THE NOTE DIV //TODO BETTER IMPLEMENTATION!
		if (noteText.trim().length === 0) {
			return $('.emtpy-titles-error').show();
		}	
		var settings = {
		  	type: 'PUT',
		  	url: '/note/' + noteId,
	  		data: {
	  			"_id": noteId,
	  			"content": noteText
	  		}
	 	}

		$('div.editing-note-container').hide();
		$('div.note').html(highlighter(formattedNoteStr)).show();
		return $.ajax(settings);
	})
}

function editTitle() {
	$('main').on('click', '.note-title', function(event) {
		event.preventDefault();  
		var noteTitle = $(this).text();
		$('div.note-title').hide();
		$('#edit-title').val(noteTitle);
		$('div.edit-title-container').show(); 
	})
}

function cancelTitleUpdate() {
	$('main').on('click', '#cancel-update', function(event) {
		event.preventDefault();
		$('.edit-title-container').hide();
		$('.note-title').show();
	})
}

function updateTitle() {
	//updating the titles
	$('main').on('click', '#update-title', function(event) {
		event.preventDefault();
		$('.emtpy-titles-error').hide();
		var noteId = $('div.note-id').text();

		var newTitle = $('#edit-title').val();
		//client side validation //test this!
		if (newTitle.trim() === 0) {
			return $('.emtpy-titles-error').show();;
		}

		var settings = {
	  		type: 'PUT',
	  		url: '/note/' + noteId,
	  		data: {
	  			"_id": noteId,
	  			"title": newTitle
	  		}	
	 	}
		
	 	$('.edit-title-container').hide();
		$('.note-title').text(newTitle).show();
		return $.ajax(settings);
	})
}

function deleteNote() {
	$('main').on('click', '.delete', function(event) {
		event.preventDefault();
		$(this).parent().next().show(); //traverse up and then down to the next p element containing the confirmation
	})
}

function confirmDelete() {
	$('main').on('click', '.confirm-delete', function(event) {
		event.preventDefault();
		var noteId = $(this).closest('div.card-content').find('div.note-id').text();
		var userNoteContainer = $(this).closest('.user-note').hide(); 
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
	clickNewNote();
	createNewNote();
	editNote();
	updateNote();
	editTitle();
	cancelTitleUpdate();
	updateTitle();
	deleteNote();
	confirmDelete();
})