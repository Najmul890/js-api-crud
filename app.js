const tableData = document.querySelector(".table-data");
const apiUrl = "http://localhost:5000/users";
let stateData = [];

// Function to fetch and display users initially
function fetchUsers() {
  let tableHtml = "";

  stateData.forEach((user) => {
    tableHtml += `
      <tr> 
        <td>${user.name}</td>
        <td>
          <div class="mx-3">${user.email}</div>
        </td>
        <td>
          <button onclick="editBtn('${user._id}')" class="btn btn-sm btn-primary">Edit</button>
          <button onclick="deleteUser('${user._id}')" class="btn btn-sm btn-danger">Delete</button>
        </td>
      </tr>
    `;
  });

  tableData.innerHTML = tableHtml;
}

function create() {
  document.querySelector(".create-form").style.display = "block";
  document.querySelector(".add-btn").style.display = "none";
}

function addUser() {
  const name = document.querySelector(".name").value;
  const email = document.querySelector(".email").value;

  fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        console.log(json);
        // Update stateData with the new user
        stateData.push({name,email});
        fetchUsers();
      }
    });

  document.querySelector(".create-form").style.display = "none";
  document.querySelector(".add-btn").style.display = "block";
}

function editBtn(id) {
  document.querySelector(".add-btn").style.display = "none";
  document.querySelector(".update-form").style.display = "block";
  document.querySelector(".create-form").style.display = "none";

  // Find the user in stateData by id
  const user = stateData.find((u) => u._id === id);
  if (user) {
    document.querySelector(".uid").value = user._id;
    document.querySelector(".uname").value = user.name;
    document.querySelector(".uemail").value = user.email;
  }
}

function updateUser() {
  const id = document.querySelector(".uid").value;
  const name = document.querySelector(".uname").value;
  const email = document.querySelector(".uemail").value;

  fetch(`http://localhost:5000/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      id, name, email
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((result) => {
      if (result) {
        // Update stateData with the updated user
        const index = stateData.findIndex((u) => u._id === id);
        if (index !== -1) {
          stateData[index].name= name;
          stateData[index].email= email;
          fetchUsers();
        }
      }
    });

  document.querySelector(".add-btn").style.display = "block";
  document.querySelector(".update-form").style.display = "none";
}

function deleteUser(id) {
  console.log(id);
  fetch(`http://localhost:5000/users/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        console.log(json);
        // Remove the user from stateData
        stateData = stateData.filter((user) => user._id !== id);
        fetchUsers();
      }
    });
}

// Initialize the UI with data when the page loads
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    stateData = data;
    fetchUsers();
  })
  .catch((error) => console.error("Error fetching users:", error));
