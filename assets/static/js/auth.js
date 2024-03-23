// Check if user is authenticated
function checkAuthentication(){
  const isAuthenticated = sessionStorage.getItem('accessToken');
  
  if(!isAuthenticated){
    // Hide the body content
    document.body.style.display = "none";
    // Redirect user to the login page after a short delay
    setTimeout(function(){
      window.location.href = '../../login.html';
    }, 100);
  }
}

// Call checkAuthentication when the dashboard page loads
window.onload = checkAuthentication;