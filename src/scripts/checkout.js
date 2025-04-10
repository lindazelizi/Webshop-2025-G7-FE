import { buyItems } from "../utils/api.js";
import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.addEventListener("DOMContentLoaded", function () {
    checkLoggedIn();
    loadOrderItems();
    cartBalanceUpdate();
    updateLoginLink();
})

function checkLoggedIn() {
    let user = localStorage.getItem("user");
    if (user === null) {
        alert("Please log in before ordering!.")
        window.location.href = "login.html"
    }
}

function loadOrderItems() {
    const orderContainer = document.getElementById("order-container");
    const paymentText = document.getElementById("order-sum-payment");
    orderContainer.innerHTML = "";
    let itemSum = 0;
    try {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length > 0) {
            cart.forEach((item) => {
                let itemProd = item.product;
                let itemDisplay = document.createElement("div");
                let name = itemProd.name;
                let img = itemProd.imageUrl;
                let price = itemProd.price;
                let quantity = item.quantity;
                itemDisplay.innerHTML = `
                <div class="order-item">
                <img src="${img}" alt="Bild på ${name}" class="checkout-img">
                <h2>${name}</h2>
                <h3>${quantity}st</h3>
                <h3>$${price * quantity}</h3>
                </div>
                `
                orderContainer.appendChild(itemDisplay);
                itemSum += item.product.price * item.quantity;
            });
        }

        paymentText.innerHTML = "$" + itemSum.toFixed(2);
        cartBalanceUpdate();
    } catch (error) {
        console.error("Error fetching items:", error);
        orderContainer.innerHTML = "<p>Failed to load items.</p>";
    }
}

document.getElementById("purchase-button").addEventListener("click", async function () {
    let cart = localStorage.getItem("cart");
    if (cart.length > 0) {
        let cartItems = JSON.parse(cart) || [];
        let formattedCart = {
            items: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }))
        };
        const orderSuccess = await buyItems(formattedCart);
        if (orderSuccess) {
            alert("Congrats on your order!")
            localStorage.setItem("cart", "[]");
            cartBalanceUpdate();
        } else {
            alert("there has been an error with your order, please try again later.")
        }
    }
    else {
        alert("your cart is empty")
    }

})      