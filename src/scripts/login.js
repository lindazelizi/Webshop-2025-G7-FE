// src/scripts/login.js
import { getBaseUrl } from "../utils/api.js";

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
    username: email, // Viktigt: backend vill ha "username", inte "email"
    password: password,
  };

  try {
    const response = await fetch(`${getBaseUrl()}api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `${token}`
      },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const result = await response.json();

      // Spara användaren i localStorage
      localStorage.setItem("user", JSON.stringify(result));

      // Navigera till startsidan
      window.location.href = "index.html";
    } else {
      alert("Fel användarnamn eller lösenord.");
    }
  } catch (error) {
    console.error("Inloggningsfel:", error);
    alert("Ett tekniskt fel uppstod vid inloggningen.");
  }
}


