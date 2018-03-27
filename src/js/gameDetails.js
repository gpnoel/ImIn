import { imin, leaveGame } from './imin.js';

// Hide the game details form on startup
document.getElementById("detailContainer").style.display = 'none';

/* Function to show game detail for selected game */
export function showGameDetails(gameID) {
	// Clear the div
	document.getElementById("detailContainer").innerHTML = "";
	document.getElementById("detailContainer").style.display = 'block';

	// return if marker is being added
	if ( gameID == 'Marker' ) {
		return;
	}

	// Get game details from database
	$.getJSON('/api/getGameDetails', 
    {
      ID: gameID
    },function(data) {

		// Get the game detail container
		var detailContainer = document.getElementById('detailContainer');
		var linebreak = document.createElement('BR');

		// Make a label for the sport
		var sportLabel = document.createElement("sportLabel");
		sportLabel.innerHTML = 'Sport: ';
		sportLabel.className += "detailLabel";
		var sport = document.createElement("sport");
		sport.innerHTML = data[0].sport;
		detailContainer.appendChild(sportLabel);
		detailContainer.appendChild(sport);
		detailContainer.appendChild(linebreak);

		// Make a label for the creator
		var creatorLabel = document.createElement("creatorLabel");
		creatorLabel.innerHTML = 'Creator: ';
		creatorLabel.className += "detailLabel";
		var creator = document.createElement("creator");
		creator.innerHTML = data[0].creatorName;
		detailContainer.appendChild(creatorLabel);
		detailContainer.appendChild(creator);
		linebreak = document.createElement('BR');
		detailContainer.appendChild(linebreak);

		// Make a label for the date
		var dateLabel = document.createElement("dateLabel");
		dateLabel.innerHTML = 'Date: ';
		dateLabel.className += "detailLabel";
		var date = document.createElement("date");
		date.innerHTML = data[0].date;
		detailContainer.appendChild(dateLabel);
		detailContainer.appendChild(date);
		linebreak = document.createElement('BR');
		detailContainer.appendChild(linebreak);

		// Make a label for the time
		var timeLabel = document.createElement("timeLabel");
		timeLabel.innerHTML = 'Time: ';
		timeLabel.className += "detailLabel";
		var time = document.createElement("time");
		time.innerHTML = data[0].time;
		detailContainer.appendChild(timeLabel);
		detailContainer.appendChild(time);
		linebreak = document.createElement('BR');
		detailContainer.appendChild(linebreak);

		// Make a label for the description
		var descriptionLabel = document.createElement("descriptionLabel");
		descriptionLabel.innerHTML = 'Description: ';
		descriptionLabel.className += "detailLabel";
		var description = document.createElement("description");
		description.innerHTML = data[0].description;
		detailContainer.appendChild(descriptionLabel);
		detailContainer.appendChild(description);
		linebreak = document.createElement('BR');
		detailContainer.appendChild(linebreak);

		// Add the button if logged in
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				addButton(gameID);
			} else {
				linebreak = document.createElement('BR');
				detailContainer.appendChild(linebreak);
				addPlayerList(gameID);
			}
		});
	});
}

/* Function to display button on the game detail form */
export function addButton(gameID) {
	// Get user info
	FB.api('/me', {fields: 'name,first_name'}, function(response) {
		$.getJSON('/api/getUserInGame', 
	    {
	      gameID: gameID,
	      userID: response.id
	    },function(data) {
	    	// Make the im in button
			var button = document.createElement("button");
	    	
	    	// See if the user is already in the game
	    	if ( data.length == 0 ) {
	    		button.innerHTML = "I'm In!";
				button.addEventListener('click', function(){ imin(gameID); });
				button.id = "iminButton";
	    	}else{
	    		button.innerHTML = "Leave Game";
				button.addEventListener('click', function(){ leaveGame(gameID); });
				button.id = "leaveGameButton";
	    	}

	    	// Add the button to the page
	    	detailContainer.appendChild(button);

	    	// Add the list of palyers
	    	addPlayerList(gameID);
	    });
	});
}

/* Function to display a list of players attending the game */
export function addPlayerList(gameID) {
	$.getJSON('/api/getUsersAttending', 
    {
      ID: gameID
    },function(data) {
    	// Make a table of users
    	var userTable = document.createElement("table");
    	var firstRow = userTable.insertRow(0);
    	firstRow.innerHTML = "Players:";
    	firstRow.className += "detailLabel";

    	// Add a row for every user
    	data.forEach(function(element) {
    		var row = userTable.insertRow(-1);
    		var cell1 = row.insertCell(0);
    		var cell2 = row.insertCell(1);
    		cell2.innerHTML = element.name;
    		var img = document.createElement('img');
    		img.src = 'https://graph.facebook.com/'+element.userID+'/picture';
    		var a=document.createElement('a');
			a.href='https://facebook.com/'+element.userID;
			a.target='_blank';
    		a.appendChild(img)
    		cell1.appendChild(a);
    	});

    	// Add the table to the game detail form
    	detailContainer.appendChild(userTable);
		var linebreak = document.createElement('BR');
		detailContainer.appendChild(linebreak);
    	
    	// Add the chat messages
    	showMessages(gameID);
    });
}

/* Function to display a list of chat messages */
export function showMessages(gameID) {
	// Add the message board label
	var messagesLabel = document.createElement("messagesLabel");
    messagesLabel.innerHTML = "Message Board:";
    messagesLabel.className += "detailLabel";
	detailContainer.appendChild(messagesLabel);
	var linebreak = document.createElement('BR');
	detailContainer.appendChild(linebreak);

	// Get messages for current game
	$.getJSON('/api/getGameMessages', 
    {
      ID: gameID
    },function(data) {
    	// Make a table of messages
    	var messageTable = document.createElement("table");
    	messageTable.style.width = '95%';

    	// Check to see if there are any messages to display
    	if  (data.length > 0) {
    		data.forEach(function(element) {
	    		var row = messageTable.insertRow(-1);
	    		row.style.borderBottom="thin solid 	#383838"
	    		row.style.borderTop="thin solid 	#383838"
	    		var cell1 = row.insertCell(0);
	    		var cell2 = row.insertCell(1);
	    		cell2.innerHTML = element.message + '<br /><br />' + element.date + "  " + element.time;
	    		var img = document.createElement('img');
	    		img.src = 'https://graph.facebook.com/'+element.userID+'/picture';
	    		var a=document.createElement('a');
				a.href='https://facebook.com/'+element.userID;
				a.target='_blank';
	    		a.appendChild(img)
	    		cell1.appendChild(a);
	    		cell1.style.verticalAlign ='top';
	    		cell1.style.width='55px';
	    		cell1.style.paddingTop="2px";
	    		cell1.appendChild(a);
    		});
    	} else {
    		var secondRow = messageTable.insertRow(-1);
    		secondRow.innerHTML = "No messages";
    	}

    	// Add the table to the game detail form
    	detailContainer.appendChild(messageTable);
		linebreak = document.createElement('BR');
		detailContainer.appendChild(linebreak);

    	// Show the new message form if logged in
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				showMessageForm(gameID);
			}
		});
    });
}

/* Function to display the new message form */
export function showMessageForm(gameID) {
	// Get user info
	FB.api('/me', {fields: 'name,first_name'}, function(response) {
    	// Make the table for the form
    	var formTable = document.createElement("table");
    	var row = formTable.insertRow(0);
	    var cell1 = row.insertCell(0);
	    var cell2 = row.insertCell(1);

    	// Make the text box
		var textBox = document.createElement("textarea");
		textBox.rows = 1;
		textBox.className = "form-control";
		cell1.style.width = '80%'
		cell1.appendChild(textBox);

		// Make the submit button
		var button = document.createElement("button");
		button.innerHTML = "Submit";	
		button.addEventListener('click', function(){ submitMessage(gameID, textBox.value); });
		button.className = "btn";
		button.style.marginLeft = '3px';
		cell2.appendChild(button);
    	
    	// Add the form to the page
    	detailContainer.appendChild(formTable);
	});
}