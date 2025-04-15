const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('psw');
const repeatPasswordInput = document.getElementById('psw-repeat');
const cancelButton = document.getElementById('cancelBtn'); // Avbryt-knappen
const termsCheckbox = document.querySelector('input[name="remember"]'); 


function isValidUsername(username) {
  const regex = /^(?=.{3,16}$)[a-zA-Z0-9_-]+$/;
  return regex.test(username);
}

// Kontrollera om användarnamnet är tillgängligt
async function isUsernameAvailable(username) {
  try {
    const response = await fetch('https://webshop-2025-be-g7.vercel.app/api/auth/check-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Kunde inte kontrollera användarnamnet.');
    }

    return data.available; 
  } catch (error) {
    console.error('Error checking username availability:', error);
    alert('Ett fel uppstod vid kontroll av användarnamnet. Försök igen senare.');
    return false; 
  }
}

// Registreringsformuläret
form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const username = emailInput.value.trim();
  const password = passwordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  if (!isValidUsername(username)) {
    alert('Användarnamnet måste vara 3-16 tecken långt och får endast innehålla bokstäver, siffror, understreck eller bindestreck.');
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

  if (!termsCheckbox.checked) {
    alert('Du måste godkänna våra Användarvillkor för att skapa ett konto.');
    return;
  }
  const isAvailable = await isUsernameAvailable(username);
  if (!isAvailable) {
    alert('Användarnamnet är redan upptaget. Välj ett annat.');
    return;
  }

  const userData = {
    username: username,
    password: password,
    isAdmin: false
  };

  console.log('User data being sent:', userData);

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
      console.error('Server response:', data);
      errorMessage.textContent = data.error || 'Registreringen misslyckades. Försök igen.';
      return;
    }

    console.log('Registrerad användare:', data.user);
    console.log('JWT-token:', data.token);

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.user.username);

    alert('Ditt konto har skapats!');
    window.location.href = 'login.html'; 

  } catch (error) {
    console.error('Fel vid registrering:', error);
    alert(`Registrering misslyckades: ${error.message}`);
  }
});

// 🧹 Avbryt-knappen rensar formuläret
cancelButton.addEventListener('click', () => {
  form.reset();
});
