import './style.css';

import { login } from '@api';
import { PAGE } from '@constants';
import { StatusBar } from '@components';

const emailInput = document.querySelector('#email-input');
const passwordInput = document.querySelector('#password-input');
const loginForm = document.querySelector('#login-form');
const loginButton = document.querySelector('#login-button');
const errorMessage = document.querySelector('#error-message');

StatusBar();

[emailInput, passwordInput].forEach((input) =>
  input.addEventListener('input', () => {
    if (emailInput.value && passwordInput.value) loginButton.disabled = false;
    else loginButton.disabled = true;
  }),
);

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  const response = await login(user);

  if (response.ok) {
    sessionStorage.setItem('my-id', response.user._id);
    sessionStorage.setItem('my-token', response.user.token);
    sessionStorage.setItem('my-accountname', response.user.accountname);
    location.href = PAGE.home;
  } else {
    errorMessage.textContent = response.error.message;
  }
});
