function createFeedHTML(note) {
	return  `<div class="row user-note-container"> 
				<div class="col-12">
					<div class="note-id">${note._id}</div>
					<div class="user-note">
						<span class="note-header note-title"> ${note.title} </span> 
						<span class="note-header note-subtitle"> ${note.subtitle} </span> 
						<span class="view-note">view note</span>
						<div class="delete-container">
                            <span class="delete-button">Delete Note</span>
                            <span class="confirm-delete">Are you sure</span>
                            <span class="confirm-delete confirm-delete-button">Yes</span>
                        </div>
					</div>
				</div>
			</div>`
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
  				<link rel="stylesheet" type="text/css" href="css/grid.css">
  				<link rel="stylesheet" type="text/css" href="css/main.css">
			</head>
			<body>
	
				<nav>
            		<div class="row">
                		<div class="col-12 nav-container">
                    		<span class="home nav-button">Home</span>
                    		<span class="new-note-button nav-button">New Note</span>
                    		<span class="logout nav-button">Logout</span>
                		</div>
            		</div>        
        		</nav>

				<main>${notes}</main>

				<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
				<script type="text/javascript" src="js/template.js"></script>
				<script type="text/javascript" src="js/userApp.js"></script>
			</body>
			</html>`
}

function renderHTMLAfterLogout() {
	return `<main>
		<div class="signup-container">
			<div class="inner-container">
			<div class="row">
				<div class="col-12 signup-content">
					<form method="post" action="/users" class="signup-form">
						<fieldset name="signup-form">
							<label class="signup-label">Email</label>
							<input type="text" name="email" class="signup-field" placeholder="foo@bar.com" required />
							<label class="signup-label">Username</label>
							<input type="text" name="username" class="signup-field" placeholder="johnsmith123" required />
							<label class="signup-label">Password</label>
							<input type="password" name="password" class="signup-field" required />
							<label class="signup-label">Confirm Password</label>
							<input type="password" name="confirm-password" class="signup-field" required />
							<div class="authentication-button-container"><button class="authentication-button">Sign Up</button></div>
							<span><em><strong>REDIRECTED TO LOGIN IF SUCCESSFUL SIGNUP, THEN LOG BACK IN</strong></em></span>
						</fieldset>
					</form>
					<div class="signup-login-links-container"><a href="/login.html">Login</a></div>
				</div>
			</div>
			</div>
		</div>
	</main>`
}

function renderHTMLAfterSignup() {
	return `<main>
		<div class="login-container">
			<div class="inner-container">
				<div class="row">
					<div class="col-12 login-content">
						<form method="post" action="/login" class="login-form">
							<fieldset name="login-form">
								<label class="login-label">Username</label>
								<input type="text" name="username" class="login-field" placeholder="johnsmith28" required />
								<label class="login-label">Password</label>
								<input type="password" name="password" class="login-field" required />
								<button class="authentication-button login">Login</button>
							</fieldset>
						</form>
						<div class="signup-login-links-container"><a href="/index.html">Sign Up</a></div>
					</div>
				</div>
			</div>
		</div>
	</main>`
}

module.exports = {createFeedHTML, createUserHomeHTML, renderHTMLAfterLogout, renderHTMLAfterSignup}