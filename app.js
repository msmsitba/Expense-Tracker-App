// Get the form, expense list, total expense, and month selector elements
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpense = document.getElementById('total-expense');
const monthSelector = document.getElementById('month');

// Object to store expenses for each month
let expensesByMonth = JSON.parse(localStorage.getItem('expensesByMonth')) || {};

// Function to render the expense list for the selected month
function renderExpenses() {
  const selectedMonth = monthSelector.value;
  const expenses = expensesByMonth[selectedMonth] || [];

  expenseList.innerHTML = '';

  expenses.forEach((expense, index) => {
    const expenseItem = document.createElement('div');
    expenseItem.classList.add('expense-item');
    expenseItem.innerHTML = `
      <span class="expense-name">${expense.name}</span>
      <span class="expense-cost">$${expense.cost}</span>
      <button class="edit-btn" data-index="${index}">Edit</button>
    `;
    expenseList.appendChild(expenseItem);
  });

  // Update the total expense for the selected month
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.cost), 0);
  totalExpense.textContent = `$${total.toFixed(2)}`;
}

// Function to handle form submission
function addExpense(event) {
  event.preventDefault();

  const selectedMonth = monthSelector.value;
  const itemName = document.getElementById('item-name').value;
  const itemCost = document.getElementById('item-cost').value;

  const expense = {
    name: itemName,
    cost: itemCost
  };

  if (!expensesByMonth[selectedMonth]) {
    expensesByMonth[selectedMonth] = [];
  }
  expensesByMonth[selectedMonth].push(expense);

  localStorage.setItem('expensesByMonth', JSON.stringify(expensesByMonth));

  renderExpenses();

  // Clear the form fields
  expenseForm.reset();
}

// Function to handle editing an expense
function editExpense(event) {
  if (event.target.classList.contains('edit-btn')) {
    const selectedMonth = monthSelector.value;
    const expenses = expensesByMonth[selectedMonth];
    const index = event.target.dataset.index;

    const expense = expenses[index];

    const newName = prompt('Enter the new name:', expense.name);
    const newCost = prompt('Enter the new cost:', expense.cost);

    if (newName !== null && newCost !== null) {
      expense.name = newName;
      expense.cost = newCost;

      localStorage.setItem('expensesByMonth', JSON.stringify(expensesByMonth));

      renderExpenses();
    }
  }
}

// Add event listener to the form submission
expenseForm.addEventListener('submit', addExpense);

// Add event listener to the month selector
monthSelector.addEventListener('change', renderExpenses);

// Add event listener to the expense list for editing
expenseList.addEventListener('click', editExpense);

// Initial render
renderExpenses();