const tableData = document.querySelector(".table-data");
let stateData = [];
const apiUrl = "http://localhost:5000/users";

// Function to fetch and display users
function fetchUsers() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      stateData= data;
      let tableHtml = "";
      
      data.forEach((user) => {
        tableHtml += `
        <tr> 
          <td>${user.name}</td>
          <td>
              <div class="mx-3">${user.email}</div>
          </td>
          <td>
              <button onclick="editBtn(this,'${user._id}')" class="btn btn-sm btn-primary">Edit</button>
              <button onclick="deleteUser(this,'${user?._id}')" class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      `;
      });
      tableData.innerHTML = tableHtml;
    })
    .catch((error) => console.error("Error fetching posts:", error));
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
        fetchUsers();
      }
    });

  document.querySelector(".create-form").style.display = "none";
  document.querySelector(".add-btn").style.display = "block";

  fetchUsers();
}

function editBtn(element,id) {
  console.log(element.parentNode.parentNode);
  document.querySelector(".add-btn").style.display = "none";
  document.querySelector(".update-form").style.display = "block";
  document.querySelector(".create-form").style.display = "none";

  fetch(`http://localhost:5000/users/${id}`)
    .then((response) => response.json())
    .then((user) => {
      if (user) {
        document.querySelector(".uid").value = user._id;
        document.querySelector(".uname").value = user.name;
        document.querySelector(".uemail").value = user.email;
      }
    });

  // const user = data.find((u) => u.id == id);
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
     if(result){
      console.log(result);
     }
  });

  document.querySelector(".add-btn").style.display = "block";
  document.querySelector(".update-form").style.display = "none";

}

function deleteUser(element,id) {
  console.log(id);
  // data = data.filter((user) => user.id !== id);
  fetch(`http://localhost:5000/users/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((json) => {
      if (json) {
        element.parentNode.parentNode.style.display="none";
      }
    });
}


fetchUsers();
