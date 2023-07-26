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
              <td><button class="deleteBtn"  data-person-id="${personId}">Delete</button>
              <button class="editBtn"  data-person-id="${personId}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
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

///// DELETE
function deletePerson(personId) {
  const tableBody = document.querySelector(".fl-table tbody");
  const existingData = JSON.parse(localStorage.getItem("people")) || [];

  // Use the filter method to create a new array without the person to be deleted
  const updatedData = existingData.filter((person) => person.id !== personId);

  // Update localStorage with the updated data
  localStorage.setItem("people", JSON.stringify(updatedData));

  // Remove the person's row from the table
  const rowToRemove = tableBody.querySelector(`[data-person-id="${personId}"]`);
  // console.log(rowToRemove)
  if (rowToRemove) {
    tableBody.removeChild(rowToRemove);
  }
}
///// DELETE END

// Load data from localStorage when the page loads
window.addEventListener("DOMContentLoaded", () => {
  const existingData = JSON.parse(localStorage.getItem("people")) || [];
  const tableBody = document.querySelector(".fl-table tbody");

  // Populate the table with data from localStorage and calculate age
  existingData.forEach((person) => {
    console.log(existingData);
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
          }" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button></td>
        `;
    tableBody.appendChild(newRow);

    // Add event listener to the delete button
    const deleteBtn = newRow.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      const personId = deleteBtn.getAttribute("data-person-id");
      deletePerson(personId);
    });
  });
});
