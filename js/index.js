document.addEventListener("DOMContentLoaded", () => {
  const transactionList = document.querySelector("#transactions-list");
  const transactionForm = document.querySelector("form");

  const addTransaction = transaction => {
    const newRow = document.createElement("tr");

    // Create the td elements
    const descriptionCell = document.createElement("td");
    const typeCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const delBtn = document.createElement("button");

    // Add text into the td elements
    descriptionCell.textContent = transaction.description;
    typeCell.textContent = transaction.type;
    amountCell.textContent = transaction.amount;
    delBtn.textContent = "Delete";

    // Add event listener to the button
    delBtn.addEventListener("click", () => {
      fetch(`http://localhost:3000/transactions/${transaction.id}`, {
        method: "DELETE"
      })
        .then(() => newRow.remove())
        .catch(error => console.error("Error deleting transaction:", error));
    });

    // Append all td elements to the tr
    newRow.appendChild(descriptionCell);
    newRow.appendChild(typeCell);
    newRow.appendChild(amountCell);
    newRow.appendChild(delBtn);

    transactionList.insertBefore(newRow, transactionList.firstChild);
  };

  // Create a list of existing transaction on page load
  fetch("http://localhost:3000/transactions") // localhost == 127.0.0.1
    .then(response => response.json())
    .then(transactions => {
      transactions.forEach(transaction => {
        addTransaction(transaction);
      });
    })
    .catch(error => {
      console.error("Error fetching transactions:", error);
      // alert("Error fetching transactions:", error);
    });

  // Add new transaction from form
  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    let description = this.querySelector("#description").value;
    let type = this.querySelector("#type").value;
    let amount = this.querySelector("#amount").value;

    // Create new transaction object
    const newTransactionObj = { description, type, amount };

    // Add a new transaction to the db
    fetch("http://localhost:3000/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTransactionObj)
    })
      .then(response => response.json())
      .then(transaction => {
        console.log(transaction);
        // Add a new transaction to the transaction list in the DOM
        addTransaction(transaction);
      })
      .catch(error => console.error("Error adding transaction:", error));

    this.reset();
  });
});
