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
    error: function(xhr, status, error){
      console.error('Error fetching user data:', error);
    }
  });

  // Retrieve insuranceId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const insuranceId = urlParams.get('insuranceId');

  // Function to fetch data insurance details for editing
  function fetchDataInsuranceDetails(insuranceId){
    // Make AJAX request to fetch data insurance details
    $.ajax({
      url: `${API_BASE_URL}/insurances/${insuranceId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken   
      },
      data: {
        isDeleted: false
      },
      success: function(response){
        // Populate form fields with existing data insurance details
        $('#kodeJaminan').val(response.data.code);
        $('#namaJaminan').val(response.data.name);

        // Retrieve the insuranceTypeId value from the response
        let insuranceTypeId = response.data.insuranceTypeId;

        // Make AJAX request to fetch data from `${API_BASE_URL}/insurance-types`
        $.ajax({
          url: `${API_BASE_URL}/insurance-types`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          data: {
            isDeleted: false,
            orderBy: 'insurance_type.updatedAt',
            order: 'DESC'
          },
          success: function(response){
            // Extract items from the response
            let items = response.data.items;

            // Get the select element
            let $selectElement = $('#pilihTipeJaminan');
          
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
          
            // Once options are appended, if insuranceTypeId is available, set the selected value
            if(insuranceTypeId){
              $selectElement.val(insuranceTypeId);
            }
          },
          error: function(xhr, status, error){
            console.error('Error fetching data:', error);
          }
        });

        $('#tampilHargaKwitansi').prop('checked', response.data.isIncludedInReceipt);
        $('#insuranceId').val(response.data.id);
      },
      error: function(xhr, status, error){
        console.error('Error fetching data layanan details:', error);
        // Handle error as needed
      }
    });
  }
  
  // If insuranceId is provided, fetch data insurance details for editing
  if(insuranceId){
    fetchDataInsuranceDetails(insuranceId);
  }else{
    // Make AJAX request to fetch data from `${API_BASE_URL}/insurance-types`
    $.ajax({
      url: `${API_BASE_URL}/insurance-types`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      data: {
        isActive: true,
        isDeleted: false,
        orderBy: 'insurance_type.updatedAt',
        order: 'DESC'
      },
      success: function(response){
        // Extract items from the response
        let items = response.data.items;
      
        // Get the select element
        let $selectElement = $('#pilihTipeJaminan');
      
        // Clear existing options
        $selectElement.empty();

        // Add a placeholder option
        $selectElement.append($('<option>', {
          value: undefined,
          text: 'Pilih Nama Tipe Jaminan',
          selected: true,
          disabled: true,
          hidden: true
        }));
      
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

    // Get form data
    let formData = {
      id: $('#insuranceId').val(),  // For PUT method
      code: $('#kodeJaminan').val(),
      name: $('#namaJaminan').val(),
      isIncludedInReceipt: $('#tampilHargaKwitansi').is(':checked'),
      insuranceTypeId: $('#pilihTipeJaminan').find('option:selected').attr('value')
    };

    // Validate form data
    if(formData.code === '' || formData.name === '' || formData.insuranceTypeId === undefined){
      Toast.fire({
        icon: 'warning',
        title: 'Isi semua data terlebih dahulu.'
      });
      return; // Stop further execution if validation fails
    }

    // Determine the appropriate API endpoint based on whether it's for adding or editing
    let apiUrl = insuranceId ? `${API_BASE_URL}/insurances/${insuranceId}` : `${API_BASE_URL}/insurances`;

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
        let message = insuranceId ? 'Data Jaminan berhasil diperbarui' : 'Data Jaminan berhasil ditambahkan';
        Swal.fire({
          title: message,
          html:
            'Kode Jaminan : ' + formData.code + '<br>' +
            'Nama Jaminan : ' + formData.name + '<br>' +
            'Tipe Jaminan : ' + $('#pilihTipeJaminan option:selected').text()
        });
      
        if(httpMethod === 'POST'){
          // Clear form fields after successful submission
          $('#kodeJaminan').val('');
          $('#namaJaminan').val('');
          $('#pilihTipeJaminan').val('').find('option:eq(0)').prop('selected', true);
          $('#tampilHargaKwitansi').prop('checked', false);
        }else if(httpMethod === 'PUT'){
          // Populate form fields with existing data Bed details
          $('#insuranceId').val(insuranceId);
          $('#kodeJaminan').val(formData.code);
          $('#namaJaminan').val(formData.name);
          $('#tampilHargaKwitansi').prop('checked', formData.isIncludedInReceipt);
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