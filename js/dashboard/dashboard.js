$(document).ready(function(){
  // Retrieve access token from sessionStorage
  var accessToken = sessionStorage.getItem('accessToken');
  
  // Make an AJAX request to fetch user data
  $.ajax({
    url: `${API_BASE_URL}/auth`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response){
      // Populate dropdown with user data
      $('#userName').text(response.data.username);
      // $('#userRole').text(response.data.role);
      // $('#userAvatar').attr('src', response.data.avatar);
      // Greeting message
      $('#greetingHeader').text('Hello, ' + response.data.username + '!');
    },
    error: function(xhr, status, error) {
      console.error('Error fetching user data:', error);
    }
  });
});


// Add click event to logout button
$("#logoutButton").click(function(event){
  event.preventDefault(); // Prevent the default action of the link

  // Remove user data and user ID from sessionStorage
  sessionStorage.removeItem('accessToken');
  // sessionStorage.removeItem('userId');

  // Redirect to the login page
  window.location.href = '../../login.html';
});