function submitMessage(gameID, message) {
	// Create a date object
	var d = new Date();

	// Get the user ID and name
	FB.api('/me', {fields: 'name,first_name'}, function(response) {
		// Add message to the the database
		$.post("/api/addMessage", {
			gameID: gameID,
			userID: response.id,
			firstName: response.first_name,
			fullName: response.name,
			msg: message,
			date: d.toLocaleDateString(),
			time: d.toLocaleTimeString()
		}, function(data){});
	});

	// Reload game detail form
	showGameDetails(gameID);
}