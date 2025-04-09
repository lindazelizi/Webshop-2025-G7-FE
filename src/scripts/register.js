const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('psw');
const repeatPasswordInput = document.getElementById('psw-repeat');

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  if (!isValidEmail(email)) {
    alert('Ange en giltig e-postadress.');
    return;
  }

  if (password.length < 8) {
    alert('Lösenordet måste vara minst 8 tecken.');
    return;
  }

  if (password !== repeatPassword) {
    alert('Lösenorden matchar inte.');
    return;
  }

  const userData = {
    username: email,
    password: password,
    isAdmin: false // eller true om du bygger ett adminformulär
  };

  try {
    const response = await fetch('https://webshop-2025-be-g7.vercel.app/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registreringen misslyckades.');
    }

    console.log('Registrerad användare:', data.user);
    console.log('JWT-token:', data.token);

    // Spara token i localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.username);

    alert('Ditt konto har skapats! Du är nu inloggad.');
    window.location.href = 'index.html'; // Ändra vid behov, t.ex. till dashboard eller startsida

  } catch (error) {
    console.error('Fel vid registrering:', error);
    alert(`Registrering misslyckades: ${error.message}`);
  }
});