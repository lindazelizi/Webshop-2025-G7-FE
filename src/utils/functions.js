// Updates balance of cart to match what's in the cart
export function cartBalanceUpdate() {
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