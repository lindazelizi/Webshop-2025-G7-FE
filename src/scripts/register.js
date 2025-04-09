// Hämta referenser till DOM-elementen
const form = document.querySelector('form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('psw');
const repeatPasswordInput = document.getElementById('psw-repeat');

// Lyssna på formulärets submit-händelse
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Förhindra att formuläret skickas vid submit

    // Validera e-postadress
    if (!isValidEmail(emailInput.value)) {
        alert('Ange en giltig e-postadress.');
        return;
    }

    // Validera lösenord
    if (passwordInput.value.length < 8) {
        alert('Lösenordet måste vara minst 8 tecken långt.');
        return;
    }

    // Kontrollera om lösenorden matchar
    if (passwordInput.value !== repeatPasswordInput.value) {
        alert('Lösenorden matchar inte.');
        return;
    }

    // Om allt är validerat korrekt, kan du här skicka formuläret eller utföra andra åtgärder
    alert('Formuläret är giltigt och kan skickas!');
});

// Hjälpfunktion för att validera e-postadress
function isValidEmail(email) {
    // En enkel e-postadressvalidering med reguljära uttryck
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
