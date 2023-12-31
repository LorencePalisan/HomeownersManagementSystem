import {doc,getDocs, setDoc,collection, query, where ,orderBy, limit, startAfter, endBefore, limitToLast, addDoc  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";

import { db } from "../credentials/firebaseModule.js";


document.addEventListener('DOMContentLoaded', (event) => {
   
    fetchAndPopulateTable();
  });


  let lastVisible; 
  let firstVisible;
  let currentPage = 1;
  


  async function fetchAndPopulateTable() {
    const propertyTable = document.getElementById("propertyTable");
    const propertyCollection = collection(db, "Property");
    const statSelect = document.getElementById("stat")?.value;
  
    // Clear existing rows in the table except the header
    while (propertyTable.rows.length > 1) {
      propertyTable.deleteRow(1);
    }
  
    // Define the base query
    let queryMem = query(propertyCollection, orderBy("ownerName"));
  
    try {
      const querySnapshot = await getDocs(queryMem);
  
      // Populate the table with the documents
      querySnapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data();
        const row = propertyTable.insertRow(-1); // Add a new row to the table
  
        if (statSelect === data.propertyStatus) {
          // Populate the row with member information
          const nameCell = row.insertCell(0);
          nameCell.textContent = data.ownerName;
  
          const categoryCell = row.insertCell(1);
          categoryCell.textContent = data.propertyStatus;
  
          const statusCell = row.insertCell(2);
          statusCell.textContent = data.lotNumber;
  
          const lotCell = row.insertCell(3);
          lotCell.textContent = data.blockNum; // Assuming these fields are in your data
  
          const blockCell = row.insertCell(4);
          blockCell.textContent = data.lotSize; // Assuming these fields are in your data
  
        
        }
      });
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }
  
  

  

  
  document.getElementById('stat').addEventListener('change', function() {
    fetchAndPopulateTable();
  });
  
// Function to convert a 2D array to a CSV string
function convertToCSV(arr) {
    return arr.map(row => row.map(item => `"${item.replace(/"/g, '""')}"`).join(',')).join('\n');
}

// Function to download a CSV file with user-selected file name
function downloadCSV(data, filename) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);

    // Append the anchor to the body, trigger a click, and then remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);
}

document.getElementById('add').addEventListener('click', function () {
  const table = document.getElementById('propertyTable');
  const data = [];
  
  // Extract table headers (th elements)
  const headerRow = table.getElementsByTagName('tr')[0];
  const headers = Array.from(headerRow.getElementsByTagName('th')).map(th => th.textContent.trim());
  data.push(headers);

  // Extract table data (td elements)
  const rows = table.getElementsByTagName('tr');
  for (let i = 1; i < rows.length; i++) {
      const row = [];
      const cells = rows[i].getElementsByTagName('td');
      for (let j = 0; j < cells.length; j++) {
          row.push(cells[j].textContent.trim());
      }
      data.push(row);
  }

  // Prompt the user for a file name
  const fileName = prompt('Enter a file name for the CSV file:');
  if (fileName) {
      downloadCSV(convertToCSV(data), fileName);
  }
});