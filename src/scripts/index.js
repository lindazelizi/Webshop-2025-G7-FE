import { fetchProducts, addProducts, checkAdmin } from "../utils/api.js";

document.addEventListener("DOMContentLoaded", loadProducts);
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

async function addProduct() {
  try {
    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      stock: document.getElementById("stock").value
    };
    console.log(product);
    // HAR INGEN ADMIN TOKEN D:
    addProducts()
  } catch (error) {
    console.error("Error adding product:", error)
  }
}

// Function to create an individual product card
function createProductCard(product) {

  const element = document.createElement("div");
  element.className = "product-card";
  // temp admin var
  let admin = true;
  // Temp ifall admin (ändra senare)
  if (admin) {
    element.innerHTML = `
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button class="add-to-cart-btn">Add to Cart</button>
  `;
  } else {
    element.innerHTML = `
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button class="add-to-cart-btn">Add to Cart</button>
  `;
  }


  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    alert(`Adding ${product.name} to cart\nFunctionality not implemented yet`);
  });

  return element;
}
