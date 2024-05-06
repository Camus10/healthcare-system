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
  
  refreshTable();
});

async function refreshTable(){
  try{
    // Destroy existing DataTable instance
    $('#table1').DataTable().destroy();

    // Retrieve access token from sessionStorage
    const accessToken = sessionStorage.getItem('accessToken');

    // Fetch clinic ID
    const clinicId = "ec5c1779-5194-471f-a902-2f451498b7ec"; // bypass

    // Fetch insurances data
    const insurancesResponse = await $.ajax({
      url: `${API_BASE_URL}/insurances`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      data: {
        isDeleted: false,
        page: 1,
        orderBy: 'insurance.updatedAt',
        order: 'DESC'
      }
    });

    // Extract items from the insurances response
    const items = insurancesResponse.data.items;

    // Fetch insurance types data for all items in parallel
    const insuranceTypePromises = items.map(item =>
      $.ajax({
        url: `${API_BASE_URL}/insurance-types/${item.insuranceTypeId}`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        data: {
          isDeleted: false
        }
      })
    );

    // Wait for all insurance types data to be fetched
    const insuranceTypeResponses = await Promise.all(insuranceTypePromises);

    // Map the fetched insurance types data to the corresponding item
    items.forEach((item, index) => {
      // Check if insuranceTypeResponses[index].data is not null before accessing its 'name' property
      item.insuranceTypesName = insuranceTypeResponses[index].data !== null ? insuranceTypeResponses[index].data.name : null;
    });

    // Initialise DataTable with items
    $('#table1').DataTable({
      data: items,
      columns: [
        { data: 'code' },
        { data: 'name' },
        {
          data: 'insuranceTypesName',
          render: function(data){
            return data !== null && data !== undefined ? data : '';
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
  }catch(error){
    console.error('Error fetching or processing data:', error);
  }
}

function editData(data){
  // Navigate to updateDataJaminan.html with insuranceId as a query parameter
  window.location.href = `updateDataJaminan.html?insuranceId=${data.id}`;
}
function deleteData(data){
  // Confirm with the user before proceeding with deletion
  Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi penghapusan',
    text: 'Data jaminan ini akan dihapus dan tidak bisa dikembalikan',
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
        url: `${API_BASE_URL}/insurances/${data.id}`,
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
            text: 'Data jaminan berhasil dihapus'
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
            text: 'Gagal menghapus data jaminan'
          });
        }
      });
    }
  });
}