export function getBaseUrl() {
  if (!window.location.href.includes('localhost')) {
    return "https://webshop-2025-be-g7-temp.vercel.app/";
  }
  return "http://localhost:3000/";
}

export function updateLoginLink() {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginLink = document.querySelector(".icon-link[href='login.html']");

  if (user && loginLink) {
    loginLink.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logga ut`;
    loginLink.href = "#";

    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "login.html";
    });
  }
}


export function cartBalanceUpdate() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart && storedCart.length > 0) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let sum = 0;
    cart.forEach(item => {
      sum += item.product.price * item.quantity;
    });

    const cartBalanceEl = document.getElementById("cartBalance");
    if (cartBalanceEl) {
      cartBalanceEl.textContent = `${Math.floor(sum)},00 kr`;
      
      const meterFill = document.querySelector('.meter-fill');
      if (meterFill) {
        const fillPercentage = Math.min(sum / 600 * 100, 100);
        meterFill.style.width = `${fillPercentage}%`;
        
        if (sum >= 500) {
          meterFill.style.backgroundColor = '#91DD4C';
        } else {
          meterFill.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
        }
        
        const checkBadge = document.querySelector('.check-badge');
        if (checkBadge) {
          if (sum >= 500) {
            checkBadge.style.display = 'flex';
          } else {
            checkBadge.style.display = 'none';
          }
        }
      }
    }
  } else {
    const cartBalanceEl = document.getElementById("cartBalance");
    if (cartBalanceEl) {
      cartBalanceEl.textContent = `0,00 kr`;
      
      const meterFill = document.querySelector('.meter-fill');
      if (meterFill) {
        meterFill.style.width = '0%';
        meterFill.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
      }
      
      const checkBadge = document.querySelector('.check-badge');
      if (checkBadge) {
        checkBadge.style.display = 'none';
      }
    }
  }
}

