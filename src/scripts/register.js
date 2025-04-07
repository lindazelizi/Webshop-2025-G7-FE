document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
  
    const showMessage = (element, message) => {
      element.textContent = message;
      element.style.display = 'block';
      setTimeout(() => {
        element.style.display = 'none';
      }, 5000);
    };
  
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
  
    const validatePassword = (password) => {
      return password.length >= 8;
    };
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Clear previous messages
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const terms = document.getElementById('terms').checked;
  
      // Validation
      if (!email || !password || !confirmPassword) {
        showMessage(errorMessage, 'Alla fält måste fyllas i');
        return;
      }
  
      if (!validateEmail(email)) {
        showMessage(errorMessage, 'Ange en giltig e-postadress');
        return;
      }
  
      if (!validatePassword(password)) {
        showMessage(errorMessage, 'Lösenordet måste vara minst 8 tecken långt');
        return;
      }
  
      if (password !== confirmPassword) {
        showMessage(errorMessage, 'Lösenorden matchar inte');
        return;
      }
  
      if (!terms) {
        showMessage(errorMessage, 'Du måste acceptera användarvillkoren');
        return;
      }
  
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        // Clear form
        form.reset();
        showMessage(successMessage, 'Konto skapat! Du kan nu logga in.');
        

      } catch (error) {
        showMessage(errorMessage, 'Ett fel uppstod. Försök igen senare.');
      }
    });
  });