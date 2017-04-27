//Template to avoid calls to the server
//just handling unauthorized people in the client.
function renderLoginMarkup() {
	$('main').on('click', 'div.get-login', function(event) {
		event.preventDefault();
		return $('main').html(getLoginTemplate())
	})
}

function renderSignupMarkup() {
	$('main').on('click', 'div.get-signup', function(event) {
		event.preventDefault();
		return $('main').html(getSignupTemplate());
	})	
}

$(function() {
	renderLoginMarkup();
	renderSignupMarkup();
})