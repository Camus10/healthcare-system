function validateUniqueKey(input) {
  // Regex for removing characters that are not alphanumeric
  let uniqueKey = input.value.replace(/[^0-9a-zA-Z]/g, '');
  
  // Update the input value
  input.value = uniqueKey;
}

function submitForm(event){
  event.preventDefault();

  // Collect form data
  const formData = {
    // uniqueKey: $('#uniqueKey').val(),
    username: $('#username').val(),
    password: $('#password').val()
  };

  // Validate form fields
  for(const field in formData){
    if(!formData[field]){
      // Show a warning Toast if any field is empty
      Toast.fire({
        icon: 'warning',
        title: 'Isi semua terlebih dahulu.'
      });
      return; // Stop execution if any field is empty
    }
  }

  // Perform authentication with backend API
  fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(response => {
    if(!response.ok){
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    if(data.success){
      // Store the access token in sessionStorage
      sessionStorage.setItem('accessToken', data.data.accessToken);

      // Display loading spinner
      // Show loading spinner
      $('#buttonText').hide();
      $('#loadingSpinner').show();
      
      // Reset the form
      $('#loginForm')[0].reset();
      
      // Simulate redirection to dashboard after 1 second
      setTimeout(function(){
        // Replace this with actual redirection logic
        window.location.href = './pages/dashboard/dashboard.html'; // Redirect to dashboard page
      }, 1000);
    }else{
      // Show error message if credentials are incorrect
      Toast.fire({
        icon: 'error',
        title: 'Kredensial salah. <br> Silakan coba lagi.'
      });
    }
  })
  .catch(error => {
    // Show error message if there is an error with the fetch request
    Toast.fire({
      icon: 'error',
      title: 'Terjadi kesalahan saat memeriksa pengguna. Silakan coba lagi.'
    });
    console.error('Error:', error);
  });
}