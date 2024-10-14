document.addEventListener("DOMContentLoaded", () => {
  const transactionList = document.querySelector("#transactions-list");
  const transactionForm = document.querySelector("form");

  let editMode = false; // Track if we're editing
  let editTransactionId = null; // Store the id of the transaction being edited

  const addTransaction = transaction => {
    const newRow = document.createElement("tr");

    // Create the td elements
    const descriptionCell = document.createElement("td");
    const typeCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const delBtn = document.createElement("button");
    const editBtn = document.createElement("button");

    // Add text into the td elements
    descriptionCell.textContent = transaction.description;
    typeCell.textContent = transaction.type;
    amountCell.textContent = transaction.amount;
    delBtn.textContent = "Delete";
    editBtn.textContent = "Edit";

    // Add event listener to the delete button
    delBtn.addEventListener("click", () => {
      fetch(`http://localhost:3000/transactions/${transaction.id}`, {
        method: "DELETE"
      })
        .then(() => newRow.remove())
        .catch(error => console.error("Error deleting transaction:", error));
    });

    // Add event listener to the edit button
    editBtn.addEventListener("click", () => {
      // Fill the form with the current transaction data
      transactionForm.querySelector("#description").value = transaction.description;
      transactionForm.querySelector("#type").value = transaction.type;
      transactionForm.querySelector("#amount").value = transaction.amount;

      // Set edit mode to true and store the transaction id
      editMode = true;
      editTransactionId = transaction.id;
    });

    // Append all td elements to the tr
    newRow.appendChild(descriptionCell);
    newRow.appendChild(typeCell);
    newRow.appendChild(amountCell);
    newRow.appendChild(delBtn);
    newRow.appendChild(editBtn);

    transactionList.insertBefore(newRow, transactionList.firstChild);
  };

  // Create a list of existing transactions on page load
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

  // Add new transaction or edit existing transaction from form
  transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Get form values
    let description = this.querySelector("#description").value;
    let type = this.querySelector("#type").value;
    let amount = this.querySelector("#amount").value;

    // Create new transaction object
    const newTransactionObj = { description, type, amount };

    if (editMode) {
      // Edit an existing transaction
      fetch(`http://localhost:3000/transactions/${editTransactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newTransactionObj)
      })
        .then(response => response.json())
        .then(updatedTransaction => {
          console.log("Updated:", updatedTransaction);
          // Optionally, refresh the transactions list or update the DOM manually
          transactionList.innerHTML = ""; // Clear the list
          fetch("http://localhost:3000/transactions") // Re-fetch all transactions to update DOM
            .then(response => response.json())
            .then(transactions => {
              transactions.forEach(transaction => {
                addTransaction(transaction);
              });
            });
          editMode = false; // Reset the edit mode
          editTransactionId = null; // Reset the id
        })
        .catch(error => console.error("Error editing transaction:", error));
    } else {
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
    }

    this.reset(); // Clear the form
  });
});
