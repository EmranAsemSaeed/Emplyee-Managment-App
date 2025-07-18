// Selectors
const employeeForm = document.getElementById('employeeForm');
const nameInput = document.getElementById('name');
const roleInput = document.getElementById('role');
const statusInput = document.getElementById('status');
const employeeTableBody = document.querySelector('#employeeTable tbody');
const trashSection = document.getElementById('trashSection');
const trashTableBody = document.querySelector('#trashTable tbody');
const trashCount = document.getElementById('trashCount');
const toggleTrashBtn = document.getElementById('toggleTrash');

let employees = [];
let trash = [];

// Helper to create status badge
function getStatusBadge(status) {
  let className = '';
  if (status === 'Active') className = 'status-active';
  else if (status === 'On Leave') className = 'status-onleave';
  else if (status === 'Terminated') className = 'status-terminated';

  return `<span class="status-badge ${className}">${status}</span>`;
}

// Validate Form and Show Error under input
function validateForm() {
  let isValid = true;

  if (!nameInput.value.trim()) {
    setError(nameInput, 'Name is required');
    isValid = false;
  } else {
    clearError(nameInput);
  }

  if (!roleInput.value.trim()) {
    setError(roleInput, 'Role is required');
    isValid = false;
  } else {
    clearError(roleInput);
  }

  if (!statusInput.value) {
    setError(statusInput, 'Status is required');
    isValid = false;
  } else {
    clearError(statusInput);
  }

  return isValid;
}

function setError(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector('small');
  small.textContent = message;
  small.style.visibility = 'visible';
  input.classList.add('error');
}

function clearError(input) {
  const formControl = input.parentElement;
  const small = formControl.querySelector('small');
  small.textContent = '';
  small.style.visibility = 'hidden';
  input.classList.remove('error');
}

// Render Employees
function renderEmployees() {
  employeeTableBody.innerHTML = '';
  employees.forEach((emp, index) => {
    employeeTableBody.innerHTML += `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.role}</td>
        <td>${getStatusBadge(emp.status)}</td>
        <td>
          <button onclick="editEmployee(${index})">Edit</button>
          <button onclick="deleteEmployee(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Render Trash
function renderTrash() {
  trashTableBody.innerHTML = '';
  trash.forEach((emp, index) => {
    trashTableBody.innerHTML += `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.role}</td>
        <td>${getStatusBadge(emp.status)}</td>
        <td>
          <button onclick="restoreEmployee(${index})">Restore</button>
          <button onclick="permanentlyDelete(${index})">Delete Permanently</button>
        </td>
      </tr>
    `;
  });
  trashCount.textContent = trash.length;
}

// Add Employee or Edit
employeeForm.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const newEmp = {
    name: nameInput.value.trim(),
    role: roleInput.value.trim(),
    status: statusInput.value
  };

  if (employeeForm.dataset.editing !== undefined) {
    employees[employeeForm.dataset.editing] = newEmp;
    delete employeeForm.dataset.editing;
  } else {
    employees.push(newEmp);
  }

  renderEmployees();
  employeeForm.reset();
  clearAllErrors();
});

// Edit Employee
function editEmployee(index) {
  const emp = employees[index];
  nameInput.value = emp.name;
  roleInput.value = emp.role;
  statusInput.value = emp.status;
  employeeForm.dataset.editing = index;
}

// Soft Delete Employee
function deleteEmployee(index) {
  trash.push(employees.splice(index, 1)[0]);
  renderEmployees();
  renderTrash();
}

// Restore from Trash
function restoreEmployee(index) {
  employees.push(trash.splice(index, 1)[0]);
  renderEmployees();
  renderTrash();
}

// Permanently Delete
function permanentlyDelete(index) {
  trash.splice(index, 1);
  renderTrash();
}

// Toggle Trash View
toggleTrashBtn.addEventListener('click', function() {
  if (trashSection.style.display === 'none') {
    trashSection.style.display = 'block';
    toggleTrashBtn.textContent = 'Hide Trash';
  } else {
    trashSection.style.display = 'none';
    toggleTrashBtn.textContent = 'Show Trash';
  }
});

// Helper to clear errors when editing is done
function clearAllErrors() {
  [nameInput, roleInput, statusInput].forEach(clearError);
}
