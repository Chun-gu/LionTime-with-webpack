import './style.css';

import { checkIsAccountnameAvailable, getImageFileName, register } from '@api';
import { ACCOUNTNAME, PAGE, REGEX, REGISTER, USERNAME } from '@constants';
import { StatusBar } from '@components';
import {
  debounce,
  getImageDataURL,
  navigate,
  promisedDebounce,
  validateImageFiles,
} from '@utils';

const email = sessionStorage.getItem('email');
sessionStorage.removeItem('email');
const password = sessionStorage.getItem('password');
sessionStorage.removeItem('password');

const form = document.querySelector('#form');
const imageInput = document.querySelector('#image-input');
const imagePreview = document.querySelector('#image-preview');
const usernameInput = document.querySelector('#username-input');
const usernameError = document.querySelector('#username-error');
const accountnameInput = document.querySelector('#accountname-input');
const accountnameError = document.querySelector('#accountname-error');
const introInput = document.querySelector('#intro-input');
const submitButton = document.querySelector('#submit-button');

let isUsernameValid = false;
let isAccountnameValid = false;

StatusBar();

imageInput.addEventListener('change', async ({ target: { files } }) => {
  const { isValid, cause } = validateImageFiles(files);

  if (isValid) {
    const imageSrc = await getImageDataURL(files[0]);
    imagePreview.src = imageSrc;
  } else alert(cause);
});

usernameInput.addEventListener(
  'input',
  debounce(({ target: { value: username } }) => {
    if (username.length === 0) {
      isUsernameValid = false;
      usernameError.textContent = '';
    } else if (2 > username.length || username.length > 10) {
      isUsernameValid = false;
      usernameError.textContent = USERNAME.length;
    } else if (/^\s|\s{2,}|\s$/.test(username)) {
      isUsernameValid = false;
      usernameError.textContent = USERNAME.noSpaces;
    } else {
      isUsernameValid = true;
      usernameError.textContent = '';
    }

    activateSubmitButton();
  }, 300),
);

accountnameInput.addEventListener(
  'input',
  promisedDebounce(async ({ target: { value: accountname } }) => {
    if (accountname.length === 0) {
      isAccountnameValid = false;
      accountnameError.textContent = '';
      return;
    }
    if (!REGEX.accountname.test(accountname)) {
      isAccountnameValid = false;
      accountnameError.textContent = ACCOUNTNAME.wrongPattern;
      return;
    }

    const { ok, message, error } = await checkIsAccountnameAvailable(
      accountname,
    );

    if (ok) {
      if (message !== ACCOUNTNAME.available) {
        isAccountnameValid = false;
        accountnameError.textContent = message;
      } else {
        isAccountnameValid = true;
        accountnameError.textContent = '';
      }
    } else {
      isAccountnameValid = false;
      accountnameError.textContent = error.message;
      alert(error);
    }

    activateSubmitButton();
  }, 300),
);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!email || !password) {
    alert(REGISTER.omitEmailPassword);
    navigate({ goBack: true, replace: true });
  }

  if (!isSubmitable()) return alert(REGISTER.requireValidation);

  let image;

  if (imageInput.value) {
    const { ok, imageFileName, error } = await getImageFileName(
      imageInput.files[0],
    );

    if (!ok) return alert(error);
    image = imageFileName;
  }

  const user = {
    email,
    password,
    image,
    username: usernameInput.value,
    accountname: accountnameInput.value,
    intro: introInput.value,
  };

  const { ok, error } = await register(user);

  if (ok) {
    alert(REGISTER.success);
    navigate({ to: PAGE.loginEmail, replace: true });
  } else alert(error);
});

function isSubmitable() {
  if (isUsernameValid && isAccountnameValid) return true;
  return false;
}

function activateSubmitButton() {
  if (isSubmitable()) submitButton.disabled = false;
  else submitButton.disabled = true;
}
