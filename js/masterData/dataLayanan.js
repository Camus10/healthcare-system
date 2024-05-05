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
  
  refreshTable();
});

function refreshTable(){
  // Destroy existing DataTable instance
  $('#table1').DataTable().destroy();

  // Retrieve access token from sessionStorage
  let accessToken = sessionStorage.getItem('accessToken');

  $.ajax({
    url: `${API_BASE_URL}/auth`,
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(response){
      // Extract clinicId from the response
      // response.data.clinic
      let clinicId = "ec5c1779-5194-471f-a902-2f451498b7ec"; // bypass
      
      // Make a new AJAX request using the extracted clinicId
      $.ajax({
        url: `${API_BASE_URL}/service-requests`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        data: {
          isDeleted: false,
          page: 1,
          orderBy: 'service_request.updatedAt',
          order: 'DESC',
          clinicIds: [clinicId] // Convert clinicId to array as required by the API
        },
        success: function(response){
          // Extract items from the response
          let items = response.data.items;

          // Initialise DataTable with items
          $('#table1').DataTable({
            data: items,
            columns: [
              { data: 'code' },
              { data: 'name' },
              { 
                data: 'type',
                render: function(data){
                  switch(data){
                    case 'in-patient':
                      return 'Rawat Inap';
                    case 'out-patient':
                      return 'Rawat Jalan';
                    case 'unitGawatDarurat':
                      return 'Unit Gawat Darurat';
                    case 'kamarOperasi':
                      return 'Kamar Operasi';
                    case 'kamarBersalin':
                      return 'Kamar Bersalin';
                    case 'penunjang':
                      return 'Penunjang';
                    default:
                      return data; // Return the original value if not matched
                  }
                }
              },
              { 
                data: 'isMedicalCheckUpIncluded',
                className: 'text-center',
                render: function(data){
                  return data ? 'Melayani' : 'Tidak';
                }
              },
              { 
                data: null,
                render: function(data, type, row){
                  return `<center>` +
                         `<button class="btn btn-sm btn-primary btn-edit" onclick="editData({ 'id': '${row.id}' })">Edit</button>` +
                         `&nbsp;` +
                         `<button class="btn btn-sm btn-danger btn-delete" onclick="deleteData({ 'id': '${row.id}' })">Delete</button>` +
                         `</center>`;

                }
              }
            ],
            order: []
          });
        },
        error: function(xhr, status, error){
          console.error('Error fetching data:', error);
        }
      });
    },
    error: function(xhr, status, error){
      console.error('Error fetching clinic data:', error);
    }
  });
}

function editData(data){
  // Navigate to updateDataLayanan.html with serviceId as a query parameter
  window.location.href = `updateDataLayanan.html?serviceId=${data.id}`;
}
function deleteData(data){
  // Confirm with the user before proceeding with deletion
  Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi penghapusan',
    text: 'Data layanan ini akan dihapus dan tidak bisa dikembalikan',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batalkan'
  }).then((result) => { 
    if(result.isConfirmed){
      // Retrieve access token from sessionStorage
      let accessToken = sessionStorage.getItem('accessToken');
      // Log the URL and request body before making the AJAX request
      $.ajax({
        url: `${API_BASE_URL}/service-requests/${data.id}`,
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        data: {"id": data.id},
        success: function(response){
          // Handle success response
          Swal.fire({
            icon: 'success',
            title: 'Penghapusan Berhasil',
            text: 'Data layanan berhasil dihapus'
          });

          refreshTable();
        },
        error: function(xhr, status, error){
          // Handle error response
          console.error('Error deleting item:', error);
          // Display an error message or handle the error as needed
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menghapus data layanan'
          });
        }
      });
    }
  });
}
