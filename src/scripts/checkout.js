import { buyItems } from "../utils/api.js";
import { cartBalanceUpdate, updateLoginLink } from "../utils/functions.js";

document.getElementById("checkout-main").addEventListener("click", function () {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length > 0) {
        let formattedCart = {
            items: cartItems.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }))
        };
        buyItems(formattedCart);
    } else {
        alert("your cart is empty")
    }

})      