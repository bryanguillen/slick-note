//services for getting and creating app markup in on server.
const services = {

	displaySignupError: function(errorMessage) {
		return `<!DOCTYPE html>
					<html>
						<head>
						<meta charset="utf-8">
						<title>Notes</title>
						<meta name="viewport" content="width=device-width, initial-scale=1">
						<!-- prevent fake favicon requests -->
						<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
						<!-- Normalize.css, a cross-browser reset file -->
  						<link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.css" rel="stylesheet">
  						<link rel="stylesheet" type="text/css" href="css/grid.css">
 					 	<!-- custom css sheet -->
  						<link rel="stylesheet" type="text/css" href="css/main.css">
					</head>
					<body>			
						<main>
							<div class="signup-container">
								<div class="inner-container">
									<div class="row">
										<div class="col-12 signup-content">
											<div>${errorMessage}</div>
											<form method="post" action="/users" class="signup-form" name="register-user">
												<fieldset name="signup-form">
													<label class="signup-label">Email</label>
													<input type="text" name="email" class="signup-field" placeholder="foo@bar.com" required />
													<label class="signup-label">Username</label>
													<input type="text" name="username" class="signup-field" placeholder="johnsmith123" required />
													<label class="signup-label">Password</label>
													<input type="password" name="password" class="signup-field" required />
													<label class="signup-label">Confirm Password</label>
													<input type="password" name="passwordConfirmation" class="signup-field" required />
													<button class="authentication-button signup" type="submit">Sign Up</button>
												</fieldset>
											</form>
											<a href="#" class="signup-login-links-container get-login">Login</a>
										</div>
									</div>
								</div>
							</div>
						</main>
						<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
						<script type="text/javascript" src="js/unauthorizedTemplates.js"></script>
						<script type="text/javascript" src="js/unauthorizedClient.js"></script>
					</body>	
					</html>`
	},

	getLoginMarkup: function(message) {
	return `<!DOCTYPE html>
				<html>
				<head>
					<meta charset="utf-8">
					<title>Notes</title>
					<meta name="viewport" content="width=device-width, initial-scale=1">
					<!-- prevent fake favicon requests -->
					<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon">
					<!-- Normalize.css, a cross-browser reset file -->
  					<link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.1.1/normalize.css" rel="stylesheet">
  					<!-- custom css sheet -->
  					<link rel="stylesheet" type="text/css" href="css/main.css">
				</head>
				<body>

					<main>
						<div class="login-container">
							<div class="inner-container">
								<div class="row">
									<div class="col-12 login-content"> 
										<div>${message}</div>
										<form method="post" action="/login" class="login-form">
											<fieldset name="login-form">
												<label class="login-label">Username</label>
											<input type="text" name="username" class="login-field" placeholder="johnsmith28" required />
											<label class="login-label">Password</label>
											<input type="password" name="password" class="login-field" required />
											<button type="submit" class="authentication-button login">Login</button>
											</fieldset>
										</form>
										<a href="#" class="signup-login-links-container">Sign Up</a>
									</div>
								</div>
							</div>
						</div>
					</main>
					
					<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
					<script type="text/javascript" src="js/unauthorizedTemplates.js"></script>
					<script type="text/javascript" src="js/unauthorizedClient.js"></script>
				</body>
				</html>`
	},

 	createUserFeedMarkup: function(note) {
	return  `<div class="card user-note">
    			<div class="card-content">
      				<div class="note-id" style="display: none;">${note._id}</div>
      				<span class="card-title activator grey-text text-darken-4">${note.title}<i class="material-icons right">read note</i></span>
      				<p><a href="#" class="edit">Edit</a></p>
      				<p><a href="#">Delete</a></p>
    			</div>
    			<div class="card-reveal">
      				<span class="card-title grey-text text-darken-4">${note.title}<i class="material-icons right">close</i></span>
      				<p>${note.content}</p>
    			</div>
  			</div>`
	},

	getUserHomeMarkup: function(notes) { 
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
  				<link rel="stylesheet" type="text/css" href="css/materialize.min.css">
  				<link rel="stylesheet" type="text/css" href="css/main.css">
			</head>
			<body>
	
				<nav>
                    <a href="#" class="home nav-button">Home</a>
                    <a href="#" class="new-note-button nav-button">New Note</a>
                    <a href="#" class="logout nav-button">Logout</a>        
        		</nav>

				<main>${notes}</main>

				<script src="https://code.jquery.com/jquery-3.1.0.js"></script>
				<script type="text/javascript" src="js/materialize.min.js"></script> 
				<script type="text/javascript" src="js/template.js"></script>
				<script type="text/javascript" src="js/userApp.js"></script>
			</body>
			</html>`
	}
}
module.exports = {services};