import { getBaseUrl } from "./api.js";  
document.addEventListener("DOMContentLoaded", initLogin);

function initLogin() {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleLogin();
  });
}

async function handleLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const loginData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch(`${getBaseUrl()}api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const result = await response.json();

      
      localStorage.setItem("user", JSON.stringify(result));

      
      window.location.href = "index.html";
    } else {
      alert("Fel e-post eller lösenord.");
    }
  } catch (error) {
    console.error("Inloggningsfel:", error);
    alert("Ett tekniskt fel uppstod vid inloggningen.");
  }
}

