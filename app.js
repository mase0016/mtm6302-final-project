/**
 * Final Project: Expense Tracker 'Architect Finance.'
 * Course: MTM6302 - Web Development with JavaScript
 * Purpose: Demonstrates DOM manipulation, event handling, and state management.
 */

// 1. STATE MANAGEMENT (Data Handling)
// We start with an initial "Opening Balance" so the math matches the UI
let transactions = [
    {
        id: Date.now(),
        description: 'Opening Balance',
        amount: 2000.00,
        category: 'Income',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
    }
];

// 2. DOM SELECTORS
// These variables store references to HTML elements so JavaScript can update them.
const balanceDisplay = document.getElementById('balance-amount'); // Targets the main total display
const incomeDisplay = document.getElementById('total-income');   // Targets the income summary box
const expenseDisplay = document.getElementById('total-expenses'); // Targets the expense summary box
const transactionList = document.getElementById('transaction-list'); // Targets the container for our history list
const transactionForm = document.getElementById('transaction-form'); // Targets the form to listen for submissions
const currentDateDisplay = document.getElementById('current-date'); // Targets the date in the header

// FUNCTION: Sets the header date automatically when the app loads
const updateHeaderDate = () => {
    const now = new Date(); // Gets the current system date/time
    const options = { month: 'long', year: 'numeric' }; // Configuration for date formatting
    // Updates the text in the HTML and converts it to uppercase for the "Architect" look
    currentDateDisplay.innerText = now.toLocaleDateString('en-US', options).toUpperCase();
};

// 3. CORE FUNCTIONS

// FUNCTION: Handles the form submission when a user adds a new transaction
function addTransaction(e) {
    e.preventDefault(); // STOPS the default form behavior of refreshing the page

    // Grabbing the values currently typed into the input fields
    const description = document.getElementById('desc').value;
    const amountInput = document.getElementById('amount').value;
    const category = document.getElementById('category').value;

    // VALIDATION: Checks if the description is empty or if the amount is not a valid number
    if (description.trim() === '' || amountInput === '' || isNaN(amountInput)) {
        alert('Please provide valid transaction details.'); // Alerts the user if inputs are wrong
        return; // Stops the function here if data is invalid
    }

    // DATA PROCESSING: Convert the string input into a floating-point number
    let amount = parseFloat(amountInput);

    // LOGIC: If the user selects anything except 'Income', we treat the amount as a negative (expense)
    if (category !== 'Income' && amount > 0) {
        amount = -amount;
    }

    // OBJECT CREATION: We bundle all the data into a single object
    const newTransaction = {
        id: Math.floor(Math.random() * 1000000), // Generates a unique ID for the delete feature
        description, // Uses ES6 shorthand for description: description
        amount,
        category,
        // Formats the date to a readable string like "APR 11"
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()
    };

    // Updating our state array with the new object
    transactions.push(newTransaction);
    
    // Trigger the UI updates to show the new data on the screen
    updateUI();
    
    // Clears the form inputs so the user can add another entry
    transactionForm.reset();
}

// FUNCTION: Recalculates all totals and refreshes the display
function updateUI() {
    // We create a new array containing ONLY the numeric amounts
    const amounts = transactions.map(t => t.amount);
    
    // REDUCE: Adds every number in the array together to get the total balance
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    // FILTER & REDUCE: Finds only positive numbers and adds them for "Total Income"
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    
    // FILTER & REDUCE: Finds only negative numbers and adds them for "Total Expenses" (multiplied by -1 for display)
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    // DOM MANIPULATION: Updating the HTML text content with the new calculated strings
    balanceDisplay.innerText = `$${total}`;
    incomeDisplay.innerText = `$${income}`;
    expenseDisplay.innerText = `$${expense}`;

    // Refresh the visual history list
    renderList();
}

// FUNCTION: Generates the HTML list items dynamically based on our transactions array
function renderList() {
    // Clear out the current list so we don't have duplicates
    transactionList.innerHTML = '';

    // If there are no transactions, show a "empty" placeholder message
    if (transactions.length === 0) {
        transactionList.innerHTML = '<p class="text-sm text-zinc-400 italic text-center py-10">No records found.</p>';
        return;
    }

    // Loop through each object in our array
    transactions.forEach(t => {
        const isIncome = t.amount > 0; // Boolean check for styling
        const item = document.createElement('div'); // Create a new container element
        // Adding the CSS classes for styling and the "Architect" animations
        item.classList.add('transaction-item', 'flex', 'justify-between', 'items-center', 'py-4', 'group');

        // TEMPLATE LITERAL: Injecting the specific transaction data into HTML structure
        item.innerHTML = `
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 flex items-center justify-center bg-zinc-100 text-zinc-900">
                    <span class="material-symbols-outlined text-sm">${isIncome ? 'payments' : 'shopping_bag'}</span>
                </div>
                <div>
                    <p class="text-sm font-bold uppercase tracking-tight">${t.description}</p>
                    <p class="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">${t.date} / ${t.category}</p>
                </div>
            </div>
            <div class="flex items-center gap-6">
                <p class="text-sm font-bold font-heading ${isIncome ? 'text-zinc-900' : 'text-[#ba1a1a]'}">
                    ${isIncome ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}
                </p>
                <button onclick="removeTransaction(${t.id})" class="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-300 hover:text-[#ba1a1a]">
                    <span class="material-symbols-outlined text-sm">delete</span>
                </button>
            </div>
        `;
        // Append the newly created element to the actual list in the browser
        transactionList.appendChild(item);
    });
}

// FUNCTION: Deletes a specific transaction from the array
function removeTransaction(id) {
    // FILTER: Creates a new array that excludes the item with the matching ID
    transactions = transactions.filter(t => t.id !== id);
    // Update the balance and the list on the screen
    updateUI();
}

// 4. INITIALIZERS & EVENT LISTENERS
// Runs once when the script loads to set the month/year
updateHeaderDate();

// Listens for the "Submit" click on the form to run our addTransaction logic
transactionForm.addEventListener('submit', addTransaction);