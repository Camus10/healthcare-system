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

  // Retrieve serviceId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('serviceId');

  // Function to fetch data layanan details for editing
  function fetchDataLayananDetails(serviceId){
    // Make AJAX request to fetch data layanan details
    $.ajax({
      url: `${API_BASE_URL}/service-requests/${serviceId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response){
        // Populate form fields with existing data layanan details
        $('#clinicId').val(response.data.clinicId);
        $('#kodeLayanan').val(response.data.code);
        $('#namaLayanan').val(response.data.name);
        $('#pilihJenisLayanan').val(response.data.type);

        // Retrieve the type value from the response
        let type = response.data.type;
        if(type === 'out-patient'){
          $('#pilihJenisLayanan').val('Rawat Jalan');
        }else if (type === 'in-patient'){
          $('#pilihJenisLayanan').val('Rawat Inap');
        }else if (type === 'unitGawatDarurat'){
          $('#pilihJenisLayanan').val('Unit Gawat Darurat');
        }else if (type === 'kamarOperasi'){
          $('#pilihJenisLayanan').val('Kamar Operasi');
        }else if (type === 'kamarBersalin'){
          $('#pilihJenisLayanan').val('Kamar Bersalin');
        }else if (type === 'penunjang'){
          $('#pilihJenisLayanan').val('Penunjang');
        }

        $('#medicalCheckUp').prop('checked', response.data.isMedicalCheckUpIncluded);
        $('#serviceId').val(serviceId);
      },
      error: function(xhr, status, error){
        console.error('Error fetching data layanan details:', error);
        // Handle error as needed
      }
    });
  }

  // If serviceId is provided, fetch data layanan details for editing
  if(serviceId){
    fetchDataLayananDetails(serviceId);
  }

  // Function to handle form submission
  $('#submitForm').click(function(event){
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    let formData = {
      id: $('#serviceId').val(),
      code: $('#kodeLayanan').val(),
      name: $('#namaLayanan').val(),
      type: $('#pilihJenisLayanan').find('option:selected').attr('id'),
      isMedicalCheckUpIncluded: $('#medicalCheckUp').is(':checked'),
      clinicId: $('#clinicId').val() ? $('#clinicId').val() : 'ec5c1779-5194-471f-a902-2f451498b7ec'
    };

    // Validate form data
    if(formData.code == '' || formData.name == ''){
      Toast.fire({
        icon: 'warning',
        title: 'Isi Nama Layanan dan Jenis Layanan.'
      });
      return; // Stop further execution if validation fails
    }

    // Determine the appropriate API endpoint based on whether it's for adding or editing
    let apiUrl = serviceId ? `${API_BASE_URL}/service-requests/${serviceId}` : `${API_BASE_URL}/service-requests`;

    // Determine the HTTP method for the request
    let httpMethod = serviceId ? 'PUT' : 'POST';

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
        let message = serviceId ? 'Data layanan berhasil diperbarui' : 'Data layanan berhasil ditambahkan';
        Swal.fire({
          title: message,
          html:
            'Kode Layanan : ' + formData.code + '<br>' +
            'Nama Layanan : ' + formData.name + '<br>' +
            'Jenis Layanan : ' + $('#pilihJenisLayanan option:selected').text()
        });
      
        if(httpMethod === 'POST'){
          // Clear form fields after successful submission
          $('#kodeLayanan').val('');
          $('#namaLayanan').val('');
          $('#pilihJenisLayanan').val('');
          $('#medicalCheckUp').prop('checked', false);
          $('#clinicId').val('');
        }else if(httpMethod === 'PUT'){
          // Populate form fields with existing data layanan details
          $('#clinicId').val(formData.clinicId);
          $('#kodeLayanan').val(formData.code);
          $('#namaLayanan').val(formData.name);
      
          // Set the selected option in the dropdown based on the type value
          switch(formData.type){
            case 'out-patient':
              $('#pilihJenisLayanan').val('Rawat Jalan');
              break;
            case 'in-patient':
              $('#pilihJenisLayanan').val('Rawat Inap');
              break;
            case 'unitGawatDarurat':
              $('#pilihJenisLayanan').val('Unit Gawat Darurat');
              break;
            case 'kamarOperasi':
              $('#pilihJenisLayanan').val('Kamar Operasi');
              break;
            case 'kamarBersalin':
              $('#pilihJenisLayanan').val('Kamar Bersalin');
              break;
            case 'penunjang':
              $('#pilihJenisLayanan').val('Penunjang');
              break;
            default:
              $('#pilihJenisLayanan').val('');
          }
      
          $('#medicalCheckUp').prop('checked', formData.isMedicalCheckUpIncluded);
          $('#serviceId').val(serviceId);
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
