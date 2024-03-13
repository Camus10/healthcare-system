// Check if user is authenticated
function checkAuthentication(){
  // Dummy authentication logic (replace with your actual authentication logic)
  const isAuthenticated = sessionStorage.getItem('authenticated');
  
  if(!isAuthenticated){
    // Hide the body content
    document.body.style.display = "none";
    // Redirect user to the login page after a short delay
    setTimeout(function() {
      window.location.href = '../../login.html';
  }, 100);
  }
}

// Call checkAuthentication when the dashboard page loads
window.onload = checkAuthentication;

// Dummy login function
function loginUser(username, password){
  // Dummy username and password
  const dummyUsername = 'admin';
  const dummyPassword = 'admin';

  // Check if username and password match the dummy credentials
  if(username === dummyUsername && password === dummyPassword){
    // Store authentication status in session storage
    sessionStorage.setItem('authenticated', true);
    // Redirect user to the dashboard after successful login
    window.location.href = './pages/dashboard/dashboard.html';
  }else{
    // Show error message (You can customize this part according to your UI)
    alert('Username or password is incorrect. Please try again.');
  }
}
