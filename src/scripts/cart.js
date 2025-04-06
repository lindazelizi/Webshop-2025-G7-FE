import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", function () {
  loadCartItems();
  updateLoginLink(); 
});

function loadCartItems() {
  const cartContainer = document.getElementById("cart-items");
  const paymentText = document.getElementById("cart-sum-payment");
  cartContainer.innerHTML = "";
  let itemSum = 0;

  try {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length > 0) {
      cart.forEach((item) => {
        const cartCard = createCartCard(item);
        cartContainer.appendChild(cartCard);
        itemSum += item.product.price * item.quantity;
      });
    }

    paymentText.innerHTML = "$" + itemSum.toFixed(2);
    cartBalanceUpdate();
  } catch (error) {
    console.error("Error fetching items:", error);
    cartContainer.innerHTML = "<p>Failed to load items.</p>";
  }
}

function createCartCard(item) {
  const element = document.createElement("div");
  const product = item.product;
  const quantity = item.quantity;
  const productSum = product.price * quantity;
  const id = product._id;

  element.className = "item-card";
  element.innerHTML = `
    <div class="cart-layout">
        <h3 class="item-name">${product.name}</h3>
        <h3 class="item-price">$${product.price}</h3>
        <div class="item-quantity">
            <button class="decrease">-</button>
            <h3 class="item-quantity">${quantity} st</h3>
            <button class="increase">+</button>
        </div>
        <h3 class="item-price-sum">$${productSum.toFixed(2)}</h3>
    </div>
  `;

  element.querySelector(".decrease").addEventListener("click", () => changeQuantity(id, -1));
  element.querySelector(".increase").addEventListener("click", () => changeQuantity(id, 1));

  return element;
}

function changeQuantity(id, num) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach((item, index) => {
    if (item.product._id === id) {
      item.quantity += num;

      if (item.quantity > item.product.stock) {
        alert("Sorry, you have reached the max amount of this item. We have no more stock!");
        item.quantity = item.product.stock;
      } else if (item.quantity < 1) {
        if (confirm("Do you want to remove this item from your cart?")) {
          cart.splice(index, 1);
        } else {
          item.quantity = 1;
        }
      }
    }
  });

  localStorage.setItem("cart", JSON.stringify(cart));
  loadCartItems();
}
