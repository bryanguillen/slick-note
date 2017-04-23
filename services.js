function createFeedHTML(note) {
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

function createUserHomeHTML(notes) {
	//find a better way to implement this. 
	return `<!DOCTYPE html>
			<html>
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width, initial-scale=1">
				<title>Notes</title>
  				<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon"> 
  				<!-- normalize css packages -->
  				<link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.css" rel="stylesheet">
  				<!--custom css page-->
  				<link rel="stylesheet" type="text/css" href="css/main.css">
			</head>
			<body>
	
				<nav>
					<div class="nav-container">
						<span>Home</span>
						<span class="new-note-button">New Note</span>
						<span class="accounts">Account</span>
					</div>
				</nav>

				<main>${notes}</main>

				<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
				<script type="text/javascript" src="js/template.js"></script>
				<script type="text/javascript" src="js/userApp.js"></script>
			</body>
			</html>`
}


module.exports = {createFeedHTML, createUserHomeHTML}