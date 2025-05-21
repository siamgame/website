document.addEventListener('DOMContentLoaded', function() {
  // Handle Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      // Simulate login
      console.log('Login Attempt:', { email, password });
      // Mock logic: For demonstration, let's say any login is successful if fields are not empty
      if (email && password) {
        alert('Login successful (mock)');
        // In a real app, you would verify credentials against a backend
        window.location.href = 'index.html'; // Redirect to homepage
      } else {
        alert('Login failed (mock - please fill in both fields)');
        console.error('Login failed: Email or password cannot be empty.');
      }
    });
  }

  // Handle Registration Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent default form submission
      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;

      // Simulate registration
      console.log('Registration Attempt:', { username, email, password });

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        console.error('Registration failed: Passwords do not match.');
        return; // Stop further processing
      }

      // Mock logic: For demonstration, let's say any registration is successful if passwords match and fields are not empty
      if (username && email && password) {
        alert('Registration successful (mock)');
        // In a real app, you would save user details to a backend
        window.location.href = 'login.html'; // Redirect to login page
      } else {
        alert('Registration failed (mock - please fill in all fields)');
        console.error('Registration failed: All fields are required.');
      }
    });
  }
});
