const pizzaOrder = new Promise((resolve, reject) => {
  const pizzaArrives = false;
  setTimeout(() => {
    if (pizzaArrives) {
      resolve("Pizza is here!");
    } else {
      reject("Pizza delivery failed.");
    }
  }, 2000);
});

// console.log(pizzaOrder);

pizzaOrder
  .then(message => console.log(message)) // If fulfilled
  .catch(error => console.log(error)); // If rejected
