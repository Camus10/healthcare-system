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

async function refreshTable(){
  try{
    // Destroy existing DataTable instance
    $('#table1').DataTable().destroy();

    // Retrieve access token from sessionStorage
    const accessToken = sessionStorage.getItem('accessToken');

    // Fetch clinic ID
    const clinicId = "ec5c1779-5194-471f-a902-2f451498b7ec"; // bypass

    // Fetch wards data
    const wardsResponse = await $.ajax({
      url: `${API_BASE_URL}/wards`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      data: {
        isDeleted: false,
        page: 1,
        orderBy: 'ward.updatedAt',
        order: 'DESC',
        clinicIds: [clinicId]
      }
    });

    // Extract items from the wards response
    const items = wardsResponse.data.items;

    // Fetch service requests data for all items in parallel
    const serviceRequestsPromises = items.map(item =>
      $.ajax({
        url: `${API_BASE_URL}/service-requests/${item.serviceRequestId}`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        data: {
          isDeleted: false
        }
      })
    );

    // Wait for all service requests data to be fetched
    const serviceRequestsResponses = await Promise.all(serviceRequestsPromises);

    // Map the fetched service requests data to the corresponding item
    items.forEach((item, index) => {
      item.serviceName = serviceRequestsResponses[index].data.name;
    });

    // Fetch beds data for each ward in parallel
    const bedRequestsPromises = items.map(item =>
      $.ajax({
        url: `${API_BASE_URL}/beds`,
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        data: {
          isDeleted: false,
          wardIds: item.id // Filter beds by wardId
        }
      })
    );

    // Wait for all bed data to be fetched
    const bedResponses = await Promise.all(bedRequestsPromises);

    // Map the fetched bed data count to the corresponding item
    items.forEach((item, index) => {
      // Assuming the beds count is obtained from the length of the items array in the bed response
      item.bedsCount = bedResponses[index].data.items.length;
    });

    // Initialise DataTable with items
    $('#table1').DataTable({
      data: items,
      columns: [
        { data: 'code' },
        { data: 'name' },
        { data: 'serviceName' },
        { 
          data: 'dailyCharge',
          render: function(data){
            // Format data as Rupiah currency
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data);
          }
        },
        {
          data: 'isActive',
          className: 'text-center',
          render: function(data){
            return data ? 'Tersedia' : 'Tidak';
          }
        },
        { 
          data: 'bedsCount', // Display the count of beds for the ward
          className: 'text-center'
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
  // Navigate to updateDataKamar.html with serviceId as a query parameter
  window.location.href = `updateDataKamar.html?serviceId=${data.id}`;
}
function deleteData(data){
  // Confirm with the user before proceeding with deletion
  Swal.fire({
    icon: 'warning',
    title: 'Konfirmasi penghapusan',
    text: 'Data kamar ini akan dihapus dan tidak bisa dikembalikan',
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
        url: `${API_BASE_URL}/wards/${data.id}`,
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
            text: 'Data kamar berhasil dihapus'
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
            text: 'Gagal menghapus data kamar'
          });
        }
      });
    }
  });
}