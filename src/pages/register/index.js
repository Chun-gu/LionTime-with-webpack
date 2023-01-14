import './style.css';

import { checkIsEmailAvailable } from '@api';
import { REGEX, EMAIL, PASSWORD, PAGE } from '@constants';
import { StatusBar } from '@components';
import { navigate, promisedDebounce } from '@utils';

let isEmailValid = false;
let isPasswordValid = false;

const emailInput = document.querySelector('#emailInput');
const emailErrorMessage = document.querySelector('#emailErrorMessage');
const passwordInput = document.querySelector('#passwordInput');
const passwordErrorMessage = document.querySelector('#passwordErrorMessage');
const nextButton = document.querySelector('#next-button');
const signupForm = document.querySelector('#signup-form');

StatusBar();

emailInput.addEventListener('input', async ({ target: { value: email } }) => {
  isEmailValid = await validateEmail(email);
  checkIsButtonDisable();
});

passwordInput.addEventListener('input', ({ target: { value } }) => {
  isPasswordValid = validatePassword(value);
  checkIsButtonDisable();
});

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  isEmailValid = await validateEmail(emailInput.value);
  isPasswordValid = validatePassword(passwordInput.value);

  checkIsButtonDisable();

  if (isEmailValid && isPasswordValid) {
    sessionStorage.setItem('email', emailInput.value);
    sessionStorage.setItem('password', passwordInput.value);
    navigate({ to: PAGE.profileSetting });
  }
});

const validateEmail = promisedDebounce(async (email) => {
  if (email.length === 0) {
    emailErrorMessage.textContent = '';
    return false;
  }

  if (REGEX.email.test(email) === false) {
    emailErrorMessage.textContent = EMAIL.wrongPattern;
    return false;
  }

  const { ok, message, error } = await checkIsEmailAvailable(email);

  if (ok && message !== EMAIL.available) {
    emailErrorMessage.textContent = message;
    return false;
  }

  if (error) {
    alert(error);
    emailErrorMessage.textContent = '';
    return false;
  }

  emailErrorMessage.textContent = '';
  return true;
}, 300);

function validatePassword(password) {
  if (password.length < 6) {
    passwordErrorMessage.textContent = PASSWORD.minLength;
    return false;
  }

  if (password.length > 16) {
    passwordErrorMessage.textContent = PASSWORD.maxLength;
    return false;
  }

  passwordErrorMessage.textContent = '';
  return true;
}

function checkIsButtonDisable() {
  const isAllValid = isEmailValid && isPasswordValid;
  nextButton.disabled = !isAllValid;
}
