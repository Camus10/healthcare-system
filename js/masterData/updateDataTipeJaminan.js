$(document).ready(function(){
  // Retrieve access token from sessionStorage
  let accessToken = sessionStorage.getItem('accessToken');
  
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

  // Retrieve insuranceId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const insuranceId = urlParams.get('insuranceId');

  // Function to fetch data tipe jaminan details for editing
  function fetchDataTipeJaminanDetails(insuranceId){
    // Make AJAX request to fetch data tipe jaminan details
    $.ajax({
      url: `${API_BASE_URL}/insurance-types/${insuranceId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response){
        // Populate form fields with existing data tipe jaminan details

        $('#kodeTipeJaminan').val(response.data.code);
        $('#namaTipeJaminan').val(response.data.name);

        // Retrieve the type value from the response
        let category = response.data.category;
        if(category === 'personal'){
          $('#pilihJenisJaminan').val('personal');
        }else if (category === 'bpjs'){
          $('#pilihJenisJaminan').val('bpjs');
        }else if (category === 'other'){
          $('#pilihJenisJaminan').val('other');
        }

        $('#insuranceId').val(insuranceId);
      },
      error: function(xhr, status, error){
        console.error('Error fetching data TipeJaminan details:', error);
        // Handle error as needed
      }
    });
  }

  // If insuranceId is provided, fetch data tipe jaminan details for editing
  if(insuranceId){
    fetchDataTipeJaminanDetails(insuranceId);
  }

  // Function to handle form submission
  $('#submitForm').click(function(event){
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    let formData = {
      id: $('#insuranceId').val(),
      code: $('#kodeTipeJaminan').val(),
      name: $('#namaTipeJaminan').val(),
      category: $('#pilihJenisJaminan').find('option:selected').attr('value')
    };

    // Validate form data
    if(formData.code === '' || formData.name === '' || formData.category === undefined){
      Toast.fire({
        icon: 'warning',
        title: 'Isi semua data terlebih dahulu.'
      });
      return; // Stop further execution if validation fails
    }

    // Determine the appropriate API endpoint based on whether it's for adding or editing
    let apiUrl = insuranceId ? `${API_BASE_URL}/insurance-types/${insuranceId}` : `${API_BASE_URL}/insurance-types`;

    // Determine the HTTP method for the request
    let httpMethod = insuranceId ? 'PUT' : 'POST';

    // Make AJAX request
    $.ajax({
      url: apiUrl,
      method: httpMethod,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      contentType: 'application/json',
      data: JSON.stringify(formData),
      success: function(response){
        // Show success message
        let message = insuranceId ? 'Data tipe jaminan berhasil diperbarui' : 'Data tipe jaminan berhasil ditambahkan';
        Swal.fire({
          title: message,
          html:
            'Kode Tipe Jaminan : ' + formData.code + '<br>' +
            'Nama Tipe Jaminan : ' + formData.name + '<br>' +
            'Jenis Jaminan : ' + $('#pilihJenisJaminan option:selected').text()
        });
      
        if(httpMethod === 'POST'){
          // Clear form fields after successful submission
          $('#kodeTipeJaminan').val('');
          $('#namaTipeJaminan').val('');
          $('#pilihJenisJaminan').val('');
        }else if(httpMethod === 'PUT'){
          // Populate form fields with existing data layanan details
          $('#kodeTipeJaminan').val(formData.code);
          $('#namaTipeJaminan').val(formData.name);
      
          // Set the selected option in the dropdown based on the category value
          switch(formData.category){
            case 'personal':
              $('#pilihJenisJaminan').val('personal');
              break;
            case 'bpjs':
              $('#pilihJenisJaminan').val('bpjs');
              break;
            case 'other':
              $('#pilihJenisJaminan').val('other');
              break;
            default:
              $('#pilihJenisJaminan').val('');
          }
      
          $('#insuranceId').val(insuranceId);
        }
      },      
      error: function(xhr, status, error){
        console.error('Error submitting data:', error);

        // Handle different error statuses
        switch(xhr.status){
          case 401:
            console.error('Unauthorized. Please log in again.');
            break;
          case 403:
            console.error('Forbidden. You do not have permission to access this resource.');
            break;
          case 408:
            console.error('Request Timeout. Please try again later.');
            break;
          case 422:
            // Unprocessable Entity error handling
            // Parse error response to display specific error messages
            let errorMessage = xhr.responseJSON.message;
            console.error('Unprocessable Entity. Details:', errorMessage);
            break;
          case 429:
            console.error('Too Many Requests. Please try again later.');
            break;
          case 500:
            console.error('Internal Server Error. Please try again later.');
            break;
          default:
            console.error('An error occurred. Please try again later.');
            break;
        }
      }
    });
  });
});