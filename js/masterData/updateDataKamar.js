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

  // Initialise AutoNumeric on the input field
  // new AutoNumeric('#chargeHarian', {
  //   currencySymbol: 'Rp ',
  //   decimalCharacter: ',',
  //   digitGroupSeparator: '.',
  //   decimalPlaces: 0,
  //   minimumValue: '0'
  // });
  // let chargeHarianValue = AutoNumeric.getNumber('#chargeHarian'); post


// kontrol input
// post and put
  // Retrieve serviceId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const serviceId = urlParams.get('serviceId');

  // Function to fetch data kamar details for editing
  function fetchDataKamarDetails(serviceId){
    // Make AJAX request to fetch data kamar details
    $.ajax({
      url: `${API_BASE_URL}/wards/${serviceId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function(response){
        // Populate form fields with existing data kamar details
        $('#kodeKamar').val(response.data.code);
        $('#namaKamar').val(response.data.name);
        $('#chargeHarian').val(response.data.dailyCharge);

        // Set the value in the input field with currency formatting
        let autoNumericInstance = new AutoNumeric('#chargeHarian', {
          currencySymbol: 'Rp ',
          decimalCharacter: ',',
          digitGroupSeparator: '.',
          decimalPlaces: 0,
          minimumValue: '0'
        });
        autoNumericInstance.set(response.data.dailyCharge);

        // Retrieve the serviceRequest value from the response
        let serviceId = response.data.serviceRequestId;

        // Make AJAX request to fetch data from `${API_BASE_URL}/service-requests`
        $.ajax({
          url: `${API_BASE_URL}/service-requests`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          data: {
            isDeleted: false,
            orderBy: 'service_request.updatedAt',
            order: 'DESC'
          },
          success: function(response){
            // Extract items from the response
            var items = response.data.items;
          
            // Get the select element
            var $selectElement = $('#pilihNamaLayanan');
          
            // Clear existing options
            $selectElement.empty();
          
            // Iterate over items and append options
            $.each(items, function(index, item){
              // Append option to the select element
              $selectElement.append($('<option>', {
                value: item.id,
                text: item.name
              }));
            });
          
            // Once options are appended, if serviceId is available, set the selected value
            if(serviceId){
              $selectElement.val(serviceId);
            }
          },
          error: function(xhr, status, error){
            console.error('Error fetching data:', error);
          }
        });

        $('#available').prop('checked', response.data.isActive);
        $('#serviceId').val(response.data.id);
      },
      error: function(xhr, status, error){
        console.error('Error fetching data layanan details:', error);
        // Handle error as needed
      }
    });
  }
  // If serviceId is provided, fetch data kamar details for editing
  if(serviceId){
    fetchDataKamarDetails(serviceId);
  }else{
    new AutoNumeric('#chargeHarian', {
      currencySymbol: 'Rp ',
      decimalCharacter: ',',
      digitGroupSeparator: '.',
      decimalPlaces: 0,
      minimumValue: '0'
    });
    
    // Make AJAX request to fetch data from `${API_BASE_URL}/service-requests`
    $.ajax({
      url: `${API_BASE_URL}/service-requests`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      data: {
        isDeleted: false,
        orderBy: 'service_request.updatedAt',
        order: 'DESC'
      },
      success: function(response){
        // Extract items from the response
        var items = response.data.items;
      
        // Get the select element
        var $selectElement = $('#pilihNamaLayanan');
      
        // Clear existing options
        $selectElement.empty();
      
        // Iterate over items and append options
        $.each(items, function(index, item){
          // Append option to the select element
          $selectElement.append($('<option>', {
            value: item.id,
            text: item.name
          }));
        });
      },
      error: function(xhr, status, error){
        console.error('Error fetching data:', error);
      }
    });
  }

  // Function to handle form submission
  $('#submitForm').click(function(event){
    event.preventDefault(); // Prevent the default form submission

    // Initialise AutoNumeric on the input field
  // new AutoNumeric('#chargeHarian 

    // Get form data
    let formData = {
      id: $('#serviceId').val(),
      code: $('#kodeKamar').val(),
      name: $('#namaKamar').val(),
      isActive: $('#available').is(':checked'),
      dailyCharge: AutoNumeric.getNumber('#chargeHarian'),
      serviceRequestId: $('#pilihNamaLayanan').find('option:selected').attr('value')
    };

    // Validate form data
    if(formData.code == '' || formData.name == '' || formData.dailyCharge == '' || formData.serviceRequestId == ''){
      Toast.fire({
        icon: 'warning',
        title: 'Isi semua data terlebih dahulu.'
      });
      return; // Stop further execution if validation fails
    }

    // Determine the appropriate API endpoint based on whether it's for adding or editing
    let apiUrl = serviceId ? `${API_BASE_URL}/wards/${serviceId}` : `${API_BASE_URL}/wards`;

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
        let message = serviceId ? 'Data kamar berhasil diperbarui' : 'Data kamar berhasil ditambahkan';
        Swal.fire({
          title: message,
          html:
            'Kode Kamar : ' + formData.code + '<br>' +
            'Nama Kamar : ' + formData.name + '<br>' +
            'Nama Layanan : ' + $('#pilihNamaLayanan option:selected').text()
        });
      
        if(httpMethod === 'POST'){
          // Clear form fields after successful submission
          $('#kodeKamar').val('');
          $('#namaKamar').val('');
          $('#chargeHarian').val('');
          $('#pilihNamaLayanan').val('');
          $('#available').prop('checked', false);
        }else if(httpMethod === 'PUT'){
          // Populate form fields with existing data Kamar details
          $('#serviceId').val(serviceId);
          $('#kodeKamar').val(formData.code);
          $('#namaKamar').val(formData.name);
          $('#chargeHarian').val(formData.dailyCharge);
          $('#chargeHarian').val(AutoNumeric.getNumber('#chargeHarian'),);
          $('#available').prop('checked', formData.isAvailable);
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