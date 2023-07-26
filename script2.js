function calculateAge(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiffernrce = today.getMonth() - birthDate.getMonth();

  if (
    monthDiffernrce < 0 ||
    (monthDiffernrce === 0 && today.getDate() < birthDate.getDate())
    // bugunun tarix birthDate tarixinde kicik olsada cixsin
  ) {
    age--;
  }

  return age;
}

function calculateSalaryWithDiscount(salary) {
  return salary - salary * 0.18;
}

function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000);
  return `${timestamp}-${randomNum}`;
}

///// ADD
function addPerson() {
  const firstName = document.getElementById("firstname").value;
  const lastName = document.getElementById("lastname").value;
  const email = document.getElementById("email").value;
  const birthday = document.getElementById("birthday").value;
  const salary = parseFloat(document.getElementById("salary").value);

  if (firstName && lastName && email && birthday && !isNaN(salary)) {
    const tableBody = document.querySelector(".fl-table tbody");

    const personId = generateUniqueId();
    // Create a new row
    const newRow = document.createElement("tr");
    const age = calculateAge(birthday);
    const discountedSalary = calculateSalaryWithDiscount(salary);
    newRow.innerHTML = `
                <td>${firstName}</td>
                <td>${lastName}</td>
                <td>${email}</td>
                <td>${age}</td>
                <td>${discountedSalary.toFixed(2)}</td>
                <td><button class="deleteBtn" data-person-id="${personId}">Delete</button>
                <button class="editBtn" data-person-id="${personId}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
            `;

    // Append the new row to the table
    tableBody.appendChild(newRow);

    // Clear the input fields after adding the new person
    document.getElementById("firstname").value = "";
    document.getElementById("lastname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("birthday").value = "";
    document.getElementById("salary").value = "";

    // Save the data to localStorage
    const data = {
      id: personId,
      firstName: firstName,
      lastName: lastName,
      email: email,
      birthday: birthday,
      salary: salary,
    };
    // console.log(data)
    const existingData = JSON.parse(localStorage.getItem("people")) || [];
    existingData.push(data);
    localStorage.setItem("people", JSON.stringify(existingData));
    // console.log(existingData)
    window.location.reload();
  } else {
    alert("Please fill out all the required fields!");
  }
}
///// ADD END

///// EDIT
function editPerson(event) {
  const row = event.target.closest("tr");
  const personId = row.getAttribute("data-person-id");
//   console.log(row);
  console.log(personId);

  // Get the person's data from localStorage
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const person = existingData.find((p) => p.id === personId);
//  console.log(existingData);

  const editForm = document.getElementById("editForm");
  editForm.elements.editFirstname.value = person.firstName;
  editForm.elements.editLastname.value = person.lastName;
  editForm.elements.editEmail.value = person.email;
  editForm.elements.editBirthday.value = person.birthday;
  editForm.elements.editSalary.value = person.salary;
//   console.log(editForm.elements.editSalary.value)
//   console.log(editForm.elements)
  // Save the personId in a data attribute to use it later for updating the row
  document
    .getElementById("exampleModal")
    .setAttribute("data-person-id", personId);
}

// Attach a click event listener to the table to handle edit button clicks
document.querySelector(".fl-table tbody").addEventListener("click", (event) => {
  if (event.target.classList.contains("editBtn")) {
    editPerson(event);
  } // tablede olan datani modala oturmek
});

function updatePersonData(personId, updatedData) {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const updatedPeople = existingData.map((person) => {
    if (person.id === personId) { // click eden vaxti duzgun id tapilibsa
      return { ...person, ...updatedData };//updatedData persona set edirik yani personun deueyrleine otururuk 
    }
    return person;
  });
  localStorage.setItem("people", JSON.stringify(updatedPeople));
}

function saveChanges() {
  const personId = document
    .getElementById("exampleModal")
    .getAttribute("data-person-id");
  const editForm = document.getElementById("editForm");
  const updatedData = {// edit modalda add elediyimiz yeni deyerleri set edirik
    firstName: editForm.elements.editFirstname.value,
    lastName: editForm.elements.editLastname.value,
    email: editForm.elements.editEmail.value,
    birthday: editForm.elements.editBirthday.value,
    salary: parseFloat(editForm.elements.editSalary.value),//edit olan deyerleri alib updatedData-nin icine atiriq
  };

  updatePersonData(personId, updatedData);

  window.location.reload();
}

document
  .querySelector(".modal-footer .btn-primary")
  .addEventListener("click", saveChanges);
///// EDIT END

//// SORT

function sortByName(data) {
  return data.sort((a, b) => a.firstName.localeCompare(b.firstName));
}

function sortByLastName(data) {
  return data.sort((a, b) => a.lastName.localeCompare(b.lastName));
}

function sortByAge(data) {
  return data.sort((a, b) => {
    const ageA = calculateAge(a.birthday);
    const ageB = calculateAge(b.birthday);
    return ageA - ageB;
  });
}

function sortBySalary(data) {
  return data.sort((a, b) => a.salary - b.salary);
}

// Event listener for sorting by Name
document.getElementById("sortByName").addEventListener("click", () => {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const sortedData = sortByName(existingData);
  updateTableWithSortedData(sortedData);
  // console.log(sortedData)
});

// Event listener for sorting by Last Name
document.getElementById("sortByLastName").addEventListener("click", () => {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const sortedData = sortByLastName(existingData);
  updateTableWithSortedData(sortedData);
});

// Event listener for sorting by Age
document.getElementById("sortByAge").addEventListener("click", () => {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const sortedData = sortByAge(existingData);
  updateTableWithSortedData(sortedData);
});

// Event listener for sorting by Salary
document.getElementById("sortBySalary").addEventListener("click", () => {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const sortedData = sortBySalary(existingData);
  updateTableWithSortedData(sortedData);
});

function updateTableWithSortedData(data) {
  const tableBody = document.querySelector(".fl-table tbody");

  // Clear the existing table rows
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
    // console.log(tableBody.firstChild)
  }
  // Populate the table with sorted data
  data.forEach((person) => {
    const age = calculateAge(person.birthday);
    const discountedSalary = calculateSalaryWithDiscount(person.salary);
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-person-id", person.id);
    //   console.log(person.id)
    newRow.dataset.age = age;
    newRow.innerHTML = `
        <td>${person.firstName}</td>
        <td>${person.lastName}</td>
        <td>${person.email}</td>
        <td>${age}</td>
        <td>${discountedSalary.toFixed(2)}</td>
        <td><button class="deleteBtn">Delete</button>
        <button class="editBtn" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
      `;
    tableBody.appendChild(newRow);
  });
}

//// SORT END

///// DELETE
function deletePerson(event) {
  const row = event.target.closest("tr");
  const personId = row.getAttribute("data-person-id");

  // Remove the row from the table
  row.remove();

  // Remove the data from localStorage
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const updatedData = existingData.filter((person) => personId !== person.id);
  localStorage.setItem("people", JSON.stringify(updatedData));
}

// Attach a click event listener to the table to handle delete button clicks
document.querySelector(".fl-table tbody").addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteBtn")) {
    deletePerson(event);
  }
});
///// DELETE END

// Load data from localStorage when the page loads
window.addEventListener("DOMContentLoaded", () => {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const tableBody = document.querySelector(".fl-table tbody");

  // Populate the table with data from localStorage and calculate age
  existingData.forEach((person) => {
    // console.log(existingData);
    const age = calculateAge(person.birthday);
    const discountedSalary = calculateSalaryWithDiscount(person.salary);
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-person-id", person.id);
    // console.log(person.id)
    newRow.dataset.age = age;
    // console.log(age)
    newRow.innerHTML = `
            <td>${person.firstName}</td>
            <td>${person.lastName}</td>
            <td>${person.email}</td>
            <td>${age}</td>
            <td>${discountedSalary.toFixed(2)}</td>
            <td><button class="deleteBtn"data-person-id="${
              person.id
            }">Delete</button>
            
            <button class="editBtn" data-person-id="${
              person.id
            }" data-bs-toggle="modal" data-bs-target="#exampleModal" >Edit</button></td>
          `;
    tableBody.appendChild(newRow);

    // // Add event listener to the delete button
    // const deleteBtn = newRow.querySelector(".deleteBtn");
    // deleteBtn.addEventListener("click", () => {
    //   const personId = deleteBtn.getAttribute("data-person-id");
    //   deletePerson(personId);
    // });
  });
});
