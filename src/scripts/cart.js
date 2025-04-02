document.addEventListener("DOMContentLoaded", function () {
    loadCartItems();
});

function loadCartItems() {
    const cartContainer = document.getElementById("cart-items");
    cartContainer.innerHTML = "";

    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        if (cart.length > 0) {
            cart.forEach((item) => {
                const cartCard = createCartCard(item);
                cartContainer.appendChild(cartCard);
            });
        }
    }
    catch (error) {
        console.error("Error fetching items:", error);
        cartContainer.innerHTML = "<p>Failed to load items.</p>";
    }
}

function createCartCard(item) {
    const element = document.createElement("div");
    const product = item.product;
    console.log(product)
    const quantity = item.quantity;
    element.className = "item-card";
    element.innerHTML = `
    <div id="item-info">
        <h3>${product.name}</h3>
        <h3>${product.price} kr</h3>
    </div>
  
  <div id="item-quantity">
    <button class="increase" onclick="changeQuantity{${quantity}, -1}">-</button>
    <h3>${quantity} st</h3>
    <button class="decrease" onclick="changeQuantity{${quantity}, 1}">+</button>
  </div>
  `;

    return element;
}

function changeQuantity(quantity, num) {
    console.log(quantity)
    console.log(sum)
}