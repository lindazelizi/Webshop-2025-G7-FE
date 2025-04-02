import { fetchProducts, addProducts, checkAdmin } from "../utils/api.js";

// Runs once site is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  updateCartItems();
});

// Runs once submit button is pressed
document.getElementById("addProduct").addEventListener("submit", function (e) {
  e.preventDefault();
  addProduct();
  loadProducts();
});

// Function to fetch and render products
async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>"; // Temporary message while loading

  try {
    const products = await fetchProducts();
    productsContainer.innerHTML = ""; // Clear loading text

    if (products.length > 0) {
      products.forEach((product) => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
      });
    } else {
      productsContainer.innerHTML = "<p>No products available.</p>";
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    productsContainer.innerHTML = "<p>Failed to load products.</p>";
  }
}


// Function to create an individual product card
function createProductCard(product) {
  const element = document.createElement("div");
  element.className = "product-card";
  element.innerHTML = `
  <h3>${product.name}</h3>
  <p>$${product.price.toFixed(2)}</p>
  <button class="add-to-cart-btn">Add to Cart</button>
  `;
  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addToCart(product)
  });

  return element;
}


// Function to add product into api
async function addProduct() {
  try {
    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      stock: document.getElementById("stock").value
    };
    console.log(product);
    // No admin token currently D:
    addProducts()
  } catch (error) {
    console.error("Error adding product:", error)
  }
}


// Adds product to cart
function addToCart(product) {
  // Get data from local storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Check if cart already has product selected
  const existingProductId = cart.findIndex(item => JSON.stringify(item.product) === JSON.stringify(product));
  // If it exists add onto stock
  if (existingProductId !== -1) {
    let existingProduct = cart[existingProductId];
    let updatedQuantity = existingProduct.quantity + 1;
    // Checks if cart already reached the max stock of the item
    if (updatedQuantity > product.stock) {
      alert("You already have all the stock in your cart");
      existingProduct.quantity = product.stock;
    } else {
      existingProduct.quantity = updatedQuantity;
    }
    cart[existingProductId] = existingProduct;
  } else {
    // If its the first one, push product into cart
    cart.push({
      product: product,
      quantity: 1
    });
  }
  // Store back into localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  cartBalanceUpdate();
}

// Function that updates updated items and removes items that have been removed
async function updateCartItems() {
  // Get data from api and local storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = await fetchProducts();

  // Filter out items that are removed
  cart = cart.filter(item => {
    let exists = products.some(product => item.product._id === product._id);
    // If it exists in api, return item into cart. Else remove it
    return exists;
  });

  // Updates items that have been changed
  cart.forEach(item => {
    products.forEach(product => {
      // If product and item id match, update the one in cart
      if (item.product._id === product._id) {
        item.product = product;
        // If item quantity in cart is higher than stock, lower them down to current stock
        if (item.quantity > item.product.stock) {
          item.quantity = item.product.stock;
        }
      }
    });
  });
  // Save to local storage again and update cart visual
  localStorage.setItem('cart', JSON.stringify(cart));
  cartBalanceUpdate();
}


// Updates balance of cart to match what's in the cart
function cartBalanceUpdate() {
  // Gets data from local storage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  // Loop that adds the total sum into cartbalance
  let cartBalance = 0;
  cart.forEach((item) => {
    cartBalance += item.product.price * item.quantity;
  })
  // Put it back into cartBalance in html with 2 decimals
  document.getElementById("cartBalance").innerHTML = "$" + cartBalance.toFixed(2);
}