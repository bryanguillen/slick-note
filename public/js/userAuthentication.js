//DOM MANIPULATION
function renderLogin(data) {
	$('body').html(data);
}

//event listener
function signup() {
	$('main').on('click', '.signup', function(event) {
		event.preventDefault();
		//traversing to fieldset in order to get values
		let fieldSet = $(this).parent().closest('fieldset');
		let email = fieldSet.find('input[name="email"]').val();
		let username = fieldSet.find('input[name="username"]').val(); 
		let password = fieldSet.find('input[name="password"]').val();
		let passwordConfirmation = fieldSet.find('input[name="confirm-password"]').val();
		let settings = {
	 		type: 'POST',
	 		url: 'https://vast-mesa-45606.herokuapp.com/users',
	 		data: {
	 			"username": username,
	 			"email": email,
	 			"password": password,
	 			"passwordConfirmation": passwordConfirmation
	 		},
	 		dataType: "html",
	 		success: renderLogin
		} 
		return $.ajax(settings)
	})
}

$(function() {
	signup();
})