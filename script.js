const transactionFormEl = document.getElementById("transaction-form")
const transactionListEl = document.getElementById("transactions")
const balanceEl = document.getElementById("balance")
const incomeAmountEl = document.getElementById("income-amount")
const expenseAmountEl = document.getElementById("expense-amount")
const descriptionEl = document.getElementById("description")
const amountEl = document.getElementById("amount")


let transactions = JSON.parse(localStorage.getItem("transactions")) || []

transactionFormEl.addEventListener("submit", (e) => {
    e.preventDefault()

    const description = descriptionEl.value.trim()
    const amount = parseFloat(amountEl.value)

    if (description != "" && amount != "") {
        transactions.push({
            id: Date.now(),
            amount,
            description,
        })
    }
    
    localStorage.setItem("transactions", JSON.stringify(transactions))

    updateTransactions()
    updateSummery()

    transactionFormEl.reset()
})

function updateTransactions() {
    transactionListEl.innerHTML = ""

    const sortedTransactions = [...transactions].reverse()

    sortedTransactions.forEach(transaction => {
        if (transaction.amount != "" && transaction.description != "") {
            const transactionEl = createTransactionEl(transaction);
            transactionListEl.appendChild(transactionEl)
        }

    })
}

function createTransactionEl(transaction) {
    const transactionEl = document.createElement("div");
    transactionEl.classList.add("item");
    transactionEl.classList.add((transaction.amount > 0 && transaction.amount != 0) ? "income" : "expense");

    transactionEl.innerHTML = `
    <span class="desc">${transaction.description}</span>
    <span class="item-amount">${formatCurrency(transaction.amount)}<button id="delete-btn" onclick="removeTransaction(${transaction.id})">X</button class="delete"></span>
    `;
    

    return transactionEl
}

function removeTransaction(id) {
    const filtereTtransactions = transactions.filter(transaction => transaction.id !== id)
    localStorage.setItem("transactions", JSON.stringify(filtereTtransactions));

    updateTransactions();
    updateSummery()
}

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN"
    }).format(amount)
}

function updateSummery() {
    const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0)
    const incomeAmount = transactions.filter(transaction => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    const expenseAmount = transactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0);


    balanceEl.innerText = formatCurrency(balance)
    incomeAmountEl.innerText = formatCurrency(incomeAmount)
    expenseAmountEl.innerHTML = formatCurrency(expenseAmount) 
}

updateTransactions()
updateSummery()