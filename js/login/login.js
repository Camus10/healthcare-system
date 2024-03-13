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
    uniqueKey: $('#uniqueKey').val(),
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

  /*
  // Use JSONPlaceholder to simulate authentication
  fetch('https://jsonplaceholder.typicode.com/users?username=' + formData.username)
    .then(response => response.json())
    .then(users => {
      // Check if user with the provided username exists
      if (users.length === 0) {
        // Show error message if user does not exist
        Toast.fire({
          icon: 'error',
          title: 'Pengguna tidak ditemukan. Silakan coba lagi.'
        });
        return;
      }

      // Check if the password matches the user's password (assuming password is stored in plain text for simplicity)
      const user = users[0];
      if (formData.password !== 'admin') { // Replace 'admin' with user.password once you have real user data
        // Show error message if password is incorrect
        Toast.fire({
          icon: 'error',
          title: 'Password salah. Silakan coba lagi.'
        });
        return;
      }

      // Dummy success message
      Swal.fire({
        icon: 'success',
        title: 'Login berhasil!',
        text: 'Anda akan dialihkan ke halaman dashboard...',
        timer: 3000, // Autoclose toast after 3 seconds
        showConfirmButton: false
      });

      // Simulate redirection to dashboard after 3 seconds
      setTimeout(function() {
        // Replace this with actual redirection logic
        window.location.href = 'dashboard.html'; // Redirect to dashboard page
      }, 3000);
    })
    .catch(error => {
      // Show error message if there is an error with the fetch request
      Toast.fire({
        icon: 'error',
        title: 'Terjadi kesalahan saat memeriksa pengguna. Silakan coba lagi.'
      });
      console.error('Error:', error);
    });
  */

  // Dummy authentication (replace with your actual authentication logic)
  if(formData.uniqueKey === '000000' && formData.username === 'admin' && formData.password === 'admin'){
    // Display loading spinner
    // Show loading spinner
    $('#buttonText').hide();
    $('#loadingSpinner').show();

    // Reset the form
    $('#loginForm')[0].reset();

    // Simulate redirection to dashboard after 3 seconds
    setTimeout(function(){
      // Replace this with actual redirection logic
      window.location.href = './pages/dashboard/dashboard.html'; // Redirect to dashboard page
    }, 2000);
  }else{
    // Show error message if credentials are incorrect
    Toast.fire({
      icon: 'error',
      title: 'Kredensial salah. Silakan coba lagi.'
    });
  }
}