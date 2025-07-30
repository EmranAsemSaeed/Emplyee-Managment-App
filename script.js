// Selectors
const employeeForm = document.getElementById('employeeForm');
const nameInput = document.getElementById('name');
const roleInput = document.getElementById('role');
const salaryInput = document.getElementById('salary');
const statusInput = document.getElementById('status');
const employeeTableBody = document.querySelector('#employeeTable tbody');
const trashSection = document.getElementById('trashSection');
const trashTableBody = document.querySelector('#trashTable tbody');
const trashCount = document.getElementById('trashCount');
const toggleTrashBtn = document.getElementById('toggleTrash');
const searchInput = document.getElementById('searchInput');
const roleFilter = document.getElementById('roleFilter');
const statusFilter = document.getElementById('statusFilter');
const minSalary = document.getElementById('minSalary');
const maxSalary = document.getElementById('maxSalary');
const minBonus = document.getElementById('minBonus');
const maxBonus = document.getElementById('maxBonus');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const totalEmployees = document.getElementById('totalEmployees');
const totalPayroll = document.getElementById('totalPayroll');
const thresholdInput = document.getElementById('thresholdInput');
const deleteThresholdBtn = document.getElementById('deleteThreshold');
const bonusModal = document.getElementById('bonusModal');
const bonusPercentage = document.getElementById('bonusPercentage');
const applyBonusBtn = document.getElementById('applyBonus');
const closeModal = document.querySelector('.close');

let employees = [];
let trash = [];
let currentEmployeeIndex = null;

// Initialize the app
function init() {
    loadEmployees();
    renderEmployees();
    updatePayrollSummary();
}

// Load sample data (for demo purposes)
function loadEmployees() {
    employees = [
        { name: "Emran Asem", role: "Developer", salary: 80000, status: "Active", bonus: 0 },
        { name: "Ali Mohammed", role: "Designer", salary: 75000, status: "Active", bonus: 0 },
        { name: "Ahmed Abdu", role: "Manager", salary: 120000, status: "Active", bonus: 0 }
    ];
    
    // Populate role filter dropdown
    const roles = [...new Set(employees.map(emp => emp.role))];
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        roleFilter.appendChild(option);
    });
}

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

    if (!salaryInput.value.trim()) {
        setError(salaryInput, 'Salary is required');
        isValid = false;
    } else if (!/^\d+$/.test(salaryInput.value.trim())) {
        setError(salaryInput, 'Salary must be a number');
        isValid = false;
    } else {
        clearError(salaryInput);
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

// Render Employees with filtering
function renderEmployees() {
    const searchTerm = searchInput.value.toLowerCase();
    const roleFilterValue = roleFilter.value;
    const statusFilterValue = statusFilter.value;
    const minSalaryValue = minSalary.value ? parseInt(minSalary.value) : null;
    const maxSalaryValue = maxSalary.value ? parseInt(maxSalary.value) : null;
    const minBonusValue = minBonus.value ? parseInt(minBonus.value) : null;
    const maxBonusValue = maxBonus.value ? parseInt(maxBonus.value) : null;

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.name.toLowerCase().includes(searchTerm);
        const matchesRole = !roleFilterValue || emp.role === roleFilterValue;
        const matchesStatus = !statusFilterValue || emp.status === statusFilterValue;
        const matchesSalary = (!minSalaryValue || emp.salary >= minSalaryValue) && 
                            (!maxSalaryValue || emp.salary <= maxSalaryValue);
        const matchesBonus = (!minBonusValue || (emp.bonus || 0) >= minBonusValue) && 
                           (!maxBonusValue || (emp.bonus || 0) <= maxBonusValue);
        
        return matchesSearch && matchesRole && matchesStatus && matchesSalary && matchesBonus;
    });

    employeeTableBody.innerHTML = '';
    filteredEmployees.forEach((emp, index) => {
        const highSalaryBadge = emp.salary >= 100000 ? 
            '<span class="high-salary-badge">High Salary</span>' : '';
        const hasBonusBadge = emp.bonus ? 
            '<span class="has-bonus-badge">Bonus</span>' : '';
        
        employeeTableBody.innerHTML += `
            <tr>
                <td>${emp.name}${highSalaryBadge}${hasBonusBadge}</td>
                <td>${emp.role}</td>
                <td>R${emp.salary.toLocaleString()}</td>
                <td>R${emp.bonus ? emp.bonus.toLocaleString() : '0'}</td>
                <td>${getStatusBadge(emp.status)}</td>
                <td>
                    <button onclick="editEmployee(${index})">Edit</button>
                    <button onclick="deleteEmployee(${index})">Delete</button>
                    <button onclick="openBonusModal(${index})">Bonus</button>
                </td>
            </tr>
        `;
    });
    
    totalEmployees.textContent = employees.length;
    updatePayrollSummary();
}

// Render Trash
function renderTrash() {
    trashTableBody.innerHTML = '';
    trash.forEach((emp, index) => {
        trashTableBody.innerHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>R${emp.salary.toLocaleString()}</td>
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

// Update payroll summary
function updatePayrollSummary() {
    const total = employees.reduce((sum, emp) => sum + emp.salary, 0);
    totalPayroll.textContent = total.toLocaleString();
}

// Add Employee or Edit
employeeForm.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    const newEmp = {
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        salary: parseInt(salaryInput.value.trim()),
        status: statusInput.value,
        bonus: 0
    };

    if (employeeForm.dataset.editing !== undefined) {
        employees[employeeForm.dataset.editing] = newEmp;
        delete employeeForm.dataset.editing;
    } else {
        employees.push(newEmp);
        
        // Update role filter dropdown if new role
        if (!Array.from(roleFilter.options).some(opt => opt.value === newEmp.role)) {
            const option = document.createElement('option');
            option.value = newEmp.role;
            option.textContent = newEmp.role;
            roleFilter.appendChild(option);
        }
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
    salaryInput.value = emp.salary;
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

// Clear all errors
function clearAllErrors() {
    [nameInput, roleInput, salaryInput, statusInput].forEach(clearError);
}

// Filter employees
applyFiltersBtn.addEventListener('click', renderEmployees);

// Reset filters
resetFiltersBtn.addEventListener('click', function() {
    searchInput.value = '';
    roleFilter.value = '';
    statusFilter.value = '';
    minSalary.value = '';
    maxSalary.value = '';
    minBonus.value = '';
    maxBonus.value = '';
    renderEmployees();
});

// Delete employees below threshold
deleteThresholdBtn.addEventListener('click', function() {
    const threshold = parseInt(thresholdInput.value);
    if (isNaN(threshold)) {
        alert('Please enter a valid salary threshold');
        return;
    }
    
    const toDelete = employees.filter(emp => emp.salary <= threshold);
    if (toDelete.length === 0) {
        alert('No employees found with salary ≤ ' + threshold);
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${toDelete.length} employee(s) with salary ≤ ${threshold}?`)) {
        trash.push(...toDelete);
        employees = employees.filter(emp => emp.salary > threshold);
        renderEmployees();
        renderTrash();
    }
});

// Bonus modal functions
function openBonusModal(index) {
    currentEmployeeIndex = index;
    bonusModal.style.display = 'block';
}

closeModal.addEventListener('click', function() {
    bonusModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === bonusModal) {
        bonusModal.style.display = 'none';
    }
});

applyBonusBtn.addEventListener('click', function() {
    const percentage = parseInt(bonusPercentage.value);
    if (isNaN(percentage)) {
        alert('Please enter a valid percentage');
        return;
    }
    
    const employee = employees[currentEmployeeIndex];
    const bonusAmount = Math.round(employee.salary * (percentage / 100));
    employee.bonus = bonusAmount;
    
    bonusModal.style.display = 'none';
    bonusPercentage.value = '';
    renderEmployees();
});

// Initialize the app
init();