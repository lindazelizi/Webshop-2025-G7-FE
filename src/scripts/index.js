import { fetchProducts, addProducts, checkAdmin, getCategories } from "../utils/api.js";
import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", function () {
  loadProducts();
  updateCartItems();
  updateLoginLink();
  testCheckAdmin();
  addProductForm();
  document.getElementById("addProduct").addEventListener("submit", function (e) {
    e.preventDefault();
    addProduct();
    loadProducts();
  });

});


async function testCheckAdmin() {
  let test = JSON.parse(localStorage.getItem("user"));

}

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
    <img src="${product.imageUrl}" alt="Bild på ${product.name}" class="prod-card-img">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button class="add-to-cart-btn">Lägg i varukorg</button>
  `;
  element.querySelector(".add-to-cart-btn").addEventListener("click", () => {
    addToCart(product);
  });

  return element;
}

function addProductForm() {
  try {
    let formContainer = document.getElementById("addProductContainer");
    let form = document.createElement("form")
    form.setAttribute("id", "addProduct");
    formContainer.innerHTML = ""
    form.innerHTML = `
        <label for="name">Namn på produkt</label>
        <input type="text" name="name" id="name" class="prodInp" required>
        <label for="ImgUrl">Bild url</label>
        <input type="text" class="prodInp" id="imageUrl" required>
        <label for="price">Pris</label>
        <input type="number" name="price" id="price" class="prodInp" min="0.01" value="0" step="any" required>
        <label for="category">Kategori</label>
        <select name="category" id="category" class="prodInp">
        <option value=""></option>
        </select>
        <label for="description">Beskrivning</label>
        <textarea name="description" id="description" class="prodInp"></textarea>
        <label for="stock">Lager</label>
        <input type="number" name="stock" id="stock" class="prodInp" min="0" value="0">
        <button type="submit">Lägg till</button>
    `
    formContainer.appendChild(form);
    fillCategory();
  } catch (error) {
    console.error("Error showing product form: ", error)
  }
}

async function fillCategory() {
  try {
    let categories = await getCategories();
    let categoryContainer = document.getElementById("category")
    categories.forEach(category => {
      let element = document.createElement("option");
      element.innerHTML = `${category.name}`;
      element.value = `${category._id}`
      categoryContainer.appendChild(element);
    });
  } catch (error) {
    console.error("Error storing categories", error)
  }



}

async function addProduct() {
  try {
    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      imageUrl: document.getElementById("imageUrl").value,
      category: document.getElementById("category").value,
      stock: document.getElementById("stock").value
    };
    console.log(product);
    addProducts(product);
  } catch (error) {
    console.error("Error adding product: ", error);
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