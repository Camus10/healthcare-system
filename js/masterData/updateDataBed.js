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
  
  // Retrieve bedId from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const bedId = urlParams.get('bedId');

  // Function to fetch data bed details for editing
  function fetchDataBedDetails(bedId){
    // Make AJAX request to fetch data bed details
    $.ajax({
      url: `${API_BASE_URL}/beds/${bedId}`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken   
      },
      data: {
        isDeleted: false
      },
      success: function(response){
        // Populate form fields with existing data bed details
        $('#kodeBed').val(response.data.code);
        $('#namaBed').val(response.data.name);

        // Extract items from the response
        let items = response.data.items;
          
        // Get the select element
        let $selectElement = $('#pilihNamaLayanan');
          
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


        // Retrieve the wardId value from the response
        let wardId = response.data.wardId;

        // Make AJAX request to fetch data from `${API_BASE_URL}/wards`
        $.ajax({
          url: `${API_BASE_URL}/wards`,
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + accessToken
          },
          data: {
            isActive: true,
            isDeleted: false,
            orderBy: 'ward.updatedAt',
            order: 'DESC'
          },
          success: function(response){
            // Extract items from the response
            let items = response.data.items;

            // Get the select element
            let $selectElement = $('#pilihNamaKamar');
          
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
          
            // Once options are appended, if wardId is available, set the selected value
            if(wardId){
              $selectElement.val(wardId);
            }
          },
          error: function(xhr, status, error){
            console.error('Error fetching data:', error);
          }
        });

        $('#available').prop('checked', response.data.isActive);
        $('#substitute').prop('checked', response.data.isActive);
        $('#bedId').val(response.data.id);
      },
      error: function(xhr, status, error){
        console.error('Error fetching data layanan details:', error);
        // Handle error as needed
      }
    });
  }
  
  // If bedId is provided, fetch data bed details for editing
  if(bedId){
    fetchDataBedDetails(bedId);
  }else{
    // Make AJAX request to fetch data from `${API_BASE_URL}/wards`
    $.ajax({
      url: `${API_BASE_URL}/wards`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      data: {
        isActive: true,
        isDeleted: false,
        orderBy: 'ward.updatedAt',
        order: 'DESC'
      },
      success: function(response){
        // Extract items from the response
        let items = response.data.items;
      
        // Get the select element
        let $selectElement = $('#pilihNamaKamar');
      
        // Clear existing options
        $selectElement.empty();

        // Add a placeholder option
        $selectElement.append($('<option>', {
          value: undefined,
          text: 'Pilih Nama Kamar',
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
      id: $('#bedId').val(),  // For PUT method
      code: $('#kodeBed').val(),
      name: $('#namaBed').val(),
      isActive: $('#available').is(':checked'),
      isSubstitute: $('#substitute').is(':checked'),
      wardId: $('#pilihNamaKamar').find('option:selected').attr('value')
    };

    // Validate form data
    if(formData.code === '' || formData.name === '' || formData.dailyCharge === '' || formData.wardId === undefined){
      Toast.fire({
        icon: 'warning',
        title: 'Isi semua data terlebih dahulu.'
      });
      return; // Stop further execution if validation fails
    }

    // Determine the appropriate API endpoint based on whether it's for adding or editing
    let apiUrl = bedId ? `${API_BASE_URL}/beds/${bedId}` : `${API_BASE_URL}/beds`;

    // Determine the HTTP method for the request
    let httpMethod = bedId ? 'PUT' : 'POST';

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
        let message = bedId ? 'Data bed berhasil diperbarui' : 'Data bed berhasil ditambahkan';
        Swal.fire({
          title: message,
          html:
            'Kode Bed : ' + formData.code + '<br>' +
            'Nama Bed : ' + formData.name + '<br>' +
            'Nama Kamar : ' + $('#pilihNamaKamar option:selected').text()
        });
      
        if(httpMethod === 'POST'){
          // Clear form fields after successful submission
          $('#kodeBed').val('');
          $('#namaBed').val('');
          $('#pilihNamaKamar').val('').find('option:eq(0)').prop('selected', true);
          $('#available').prop('checked', false);
          $('#substitute').prop('checked', false);
        }else if(httpMethod === 'PUT'){
          // Populate form fields with existing data Bed details
          $('#bedId').val(bedId);
          $('#kodeBed').val(formData.code);
          $('#namaBed').val(formData.name);
          $('#available').prop('checked', formData.isAvailable);
          $('#substitute').prop('checked', formData.isSubstitute);
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