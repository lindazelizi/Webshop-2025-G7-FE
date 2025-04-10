import { getBaseUrl } from "../utils/api.js";
import { updateLoginLink, cartBalanceUpdate } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", async function () {
  updateLoginLink();
  await loadProduct();
});

async function loadProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");
  const productContainer = document.getElementById("productContainer");

  if (!productId) {
    productContainer.innerHTML = "<p>Ingen produkt hittades.</p>";
    return;
  }

  try {
    const response = await fetch(`${getBaseUrl()}api/products/${productId}`);
    const product = await response.json();

    productContainer.innerHTML = `
      <div class="product-detail">
        <h1>${product.name}</h1>
        <img src="${product.imageUrl}" alt="${product.name}" />
        <p>${product.description}</p>
        <p><strong>Pris:</strong> $${product.price.toFixed(2)}</p>

        <div class="quantity-controls">
          <button id="decreaseBtn">-</button>
          <span id="quantity">0</span>
          <button id="increaseBtn">+</button>
        </div>
      </div>
    `;

    // Hantera kvantitet + uppdatering i localStorage
    const decreaseBtn = document.getElementById("decreaseBtn");
    const increaseBtn = document.getElementById("increaseBtn");
    const quantityDisplay = document.getElementById("quantity");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItem = cart.find((item) => item.product._id === product._id);
    let quantity = cartItem ? cartItem.quantity : 0;

    quantityDisplay.textContent = quantity;

    increaseBtn.addEventListener("click", () => {
      if (quantity < product.stock) {
        quantity++;
        updateCart(product, quantity);
        quantityDisplay.textContent = quantity;
      } else {
        alert("Du har redan lagt till allt i lager.");
      }
    });

    decreaseBtn.addEventListener("click", () => {
      if (quantity > 0) {
        quantity--;
        updateCart(product, quantity);
        quantityDisplay.textContent = quantity;
      }
    });

  } catch (error) {
    console.error("Fel vid hämtning av produkt:", error);
    productContainer.innerHTML = "<p>Kunde inte ladda produkten.</p>";
  }
}

function updateCart(product, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const index = cart.findIndex((item) => item.product._id === product._id);

  if (index !== -1) {
    if (quantity === 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
  } else {
    cart.push({ product, quantity });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  cartBalanceUpdate();
}
