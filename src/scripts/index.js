import { fetchProducts, addProducts, checkAdmin } from "../utils/api.js";
import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  updateCartItems();
  updateLoginLink(); 
});

document.getElementById("addProduct").addEventListener("submit", function (e) {
  e.preventDefault();
  addProduct();
  loadProducts();
});

async function loadProducts() {
  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = "<p>Loading products...</p>";

  try {
    const products = await fetchProducts();
    productsContainer.innerHTML = "";

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

function createProductCard(product) {
  const element = document.createElement("div");
  element.className = "product-card";
  element.innerHTML = `
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button class="view-product-btn">Visa produkt</button>
    <button class="add-to-cart-btn">Lägg i varukorg</button>
  `;

  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addToCart(product);
  });

  element.querySelector(".view-product-btn").addEventListener("click", () => {
    window.location.href = `product.html?id=${product._id}`;
  });

  return element;
}


async function addProduct() {
  try {
    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      stock: document.getElementById("stock").value
    };
    console.log(product);
    addProducts(product);
  } catch (error) {
    console.error("Error adding product:", error);
  }
}



function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductId = cart.findIndex(item => JSON.stringify(item.product) === JSON.stringify(product));

  if (existingProductId !== -1) {
    let existingProduct = cart[existingProductId];
    let updatedQuantity = existingProduct.quantity + 1;
    if (updatedQuantity > product.stock) {
      alert("You already have all the stock in your cart");
      existingProduct.quantity = product.stock;
    } else {
      existingProduct.quantity = updatedQuantity;
    }
    cart[existingProductId] = existingProduct;
  } else {
    cart.push({
      product: product,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  cartBalanceUpdate();
}

async function updateCartItems() {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = await fetchProducts();

  cart = cart.filter(item => {
    let exists = products.some(product => item.product._id === product._id);
    return exists;
  });

  cart.forEach(item => {
    products.forEach(product => {
      if (item.product._id === product._id) {
        item.product = product;
        if (item.quantity > item.product.stock) {
          item.quantity = item.product.stock;
        }
      }
    });
  });

  localStorage.setItem('cart', JSON.stringify(cart));
  cartBalanceUpdate();
}