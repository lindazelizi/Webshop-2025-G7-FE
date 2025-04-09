import { fetchProducts, cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", async () => {
  updateLoginLink();
  cartBalanceUpdate();
  
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const container = document.getElementById("productContainer");

  if (!productId) {
    container.innerHTML = "<p>Ingen produkt vald.</p>";
    return;
  }

  const products = await fetchProducts();
  const product = products.find(p => p._id === productId);

  if (!product) {
    container.innerHTML = "<p>Produkten kunde inte hittas.</p>";
    return;
  }

  let imageUrl = "https://via.placeholder.com/300x200?text=No+Image";
if (product.image && product.image.startsWith("http")) {
  imageUrl = product.image;
}


  container.innerHTML = `
    <div class="product-card">
      <h2>${product.name}</h2>
      <img 
        src="${imageUrl}" 
        alt="${product.name}" 
        style="max-width: 300px; width: 100%; height: auto; display: block; margin: 0 auto 1rem;" 
      />
      <p>${product.description || "Ingen beskrivning tillgänglig."}</p>
      <p><strong>Pris:</strong> $${product.price.toFixed(2)}</p>

      <div class="item-quantity">
        <button id="decrease">-</button>
        <span id="quantity">1</span>
        <button id="increase">+</button>
      </div>

      <button id="addToCartBtn">Lägg i varukorg</button>
    </div>
  `;

  let quantity = 1;

  document.getElementById("decrease").addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      document.getElementById("quantity").textContent = quantity;
    }
  });

  document.getElementById("increase").addEventListener("click", () => {
    if (quantity < product.stock) {
      quantity++;
      document.getElementById("quantity").textContent = quantity;
    } else {
      alert("Du har nått max antal i lager.");
    }
  });

  document.getElementById("addToCartBtn").addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingIndex = cart.findIndex(item => item.product._id === product._id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
      if (cart[existingIndex].quantity > product.stock) {
        cart[existingIndex].quantity = product.stock;
        alert("Du har nu hela lagret i kundvagnen.");
      }
    } else {
      cart.push({ product, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    cartBalanceUpdate();
    alert("Produkten har lagts i varukorgen!");
  });
});
