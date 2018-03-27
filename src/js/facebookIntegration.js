/* Setup SDK and Facebook integration */
window.fbAsyncInit = function() {
  FB.init({
    appId      : '274178513017639',
    cookie     : true,
    xfbml      : true,
    version    : 'v2.8'
  });

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* Function called after page loads & login status checked */
function statusChangeCallback(response) {
  if (response.status === 'connected') {
    showLoggedIn();
  } else {
    showLoggedOut();
  }
}

/* Function whenever button is pressed */
function facebookAction() {
  // Check the login status
  FB.getLoginStatus(function(response) {
    if ( response.status === 'connected' ) {
      logout();
    } else {
      login();
    }
  });
}

/* Function to log into Facebook */
function login() {
  FB.login(function(response) {
    if (response.status === 'connected') {
      showLoggedIn();
      addUser();
    } else {
      showLoggedOut();
    }
  });
}

/* Function to log out of Facebook */
function logout() {
  FB.logout(function(response) {
    showLoggedOut();
  });
}

/* Function to show user information */
function showLoggedIn() {
  // Set the text
  document.getElementById('facebookButton').innerHTML = 'Log Out';

  // Make username and picture visible
  document.getElementById('username').style.display = 'block';
  document.getElementById('profilePicture').style.display = 'block';

  // Set the username and profile picture
  FB.api('/me', {fields: 'name,first_name'}, function(response) {
    document.getElementById('username').innerHTML = response.name;
    document.getElementById('profilePicture').src = "https://graph.facebook.com/"+response.id+"/picture";
  });
}

/* Function to clear user information from screen */
function showLoggedOut() {
  // Set the text
  document.getElementById('facebookButton').innerHTML = 'Log In';

  // Hide the username and profile picture
  document.getElementById('username').style.display = 'none';
  document.getElementById('profilePicture').style.display = 'none';
}

/* Add user to the database if this is first visit */
function addUser() {
  FB.api('/me', {fields: 'name,first_name'}, function(response) {
    $.getJSON('/api/addUser', 
    {
      fullName: response.name,
      firstName: response.first_name,
      id: response.id
    },function(data) {});
  });
}

window.facebookAction = facebookAction;