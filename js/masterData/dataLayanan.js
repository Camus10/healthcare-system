// Dummy data
const dummyData = [
  {
    kode_layanan: "12345",
    nama_layanan: "Layanan A",
    jenis_layanan: "Jenis X",
    medical_checkup: "Melayani"
  },
  {
    kode_layanan: "67890",
    nama_layanan: "Layanan B",
    jenis_layanan: "Jenis Y",
    medical_checkup: "Melayani"
  },
  {
    kode_layanan: "54321",
    nama_layanan: "Layanan C",
    jenis_layanan: "Jenis Z",
    medical_checkup: "Tidak"
  },
  {
    kode_layanan: "98765",
    nama_layanan: "Layanan D",
    jenis_layanan: "Jenis X",
    medical_checkup: "Tidak"
  },
  {
    kode_layanan: "13579",
    nama_layanan: "Layanan E",
    jenis_layanan: "Jenis Y",
    medical_checkup: "Melayani"
  }
];

// Populate table with dummy data
populateTable(dummyData);

function populateTable(data){
  // Get the table body element
  const tableBody = document.getElementById('tableBody');

  // Clear any existing rows
  tableBody.innerHTML = '';

  // Iterate through the data and create table rows
  data.forEach((item, index) => {
    // Create a new table row
    const row = document.createElement('tr');

    // Insert data into the row
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.kode_layanan}</td>
      <td>${item.nama_layanan}</td>
      <td>${item.jenis_layanan}</td>
      <td>${item.medical_checkup}</td>
      <td>
        <a href="#" class="btn icon btn-primary btn-sm"><i class="bi bi-pencil"></i> Edit</a>
        <a href="#" class="btn icon btn-danger btn-sm"><i class="bi bi-x"></i> Hapus</a>
      </td>
    `;

    // Append the row to the table body
    tableBody.appendChild(row);
  });
}


/*
// Fetch data from API and populate the table
fetchDataAndPopulateTable();

function fetchDataAndPopulateTable(){
  // Fetch data from API
  fetch('https://api.example.com/your-endpoint')
    .then(response => response.json())
    .then(data => {
      // Get the table body element
      const tableBody = document.getElementById('tableBody');

      // Clear any existing rows
      tableBody.innerHTML = '';

      // Iterate through the data and create table rows
      data.forEach((item, index) => {
        // Create a new table row
        const row = document.createElement('tr');

        // Insert data into the row
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${item.kode_layanan}</td>
          <td>${item.nama_layanan}</td>
          <td>${item.jenis_layanan}</td>
          <td>
            <a href="#" class="btn icon btn-primary btn-sm"><i class="bi bi-pencil"></i> Edit</a>
            <a href="#" class="btn icon btn-danger btn-sm"><i class="bi bi-x"></i> Hapus</a>
          </td>
        `;

        // Append the row to the table body
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
*/