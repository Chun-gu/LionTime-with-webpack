import './style.css';

import {
  checkIsAccountnameAvailable,
  getImageFileName,
  getMyInfo,
  modifyProfile,
} from '@api';
import { StatusBar } from '@components';
import {
  ACCOUNTNAME,
  IMAGE,
  PAGE,
  REGEX,
  REGISTER,
  USERNAME,
} from '@constants';
import {
  attachImageURL,
  debounce,
  getImageDataURL,
  InputValidator,
  navigate,
  promisedDebounce,
  saveCurrentPageURL,
  validateImageFiles,
} from '@utils';

const form = document.querySelector('#form');
const imagePreview = document.querySelector('#image-preview');
const imageInput = document.querySelector('#image-input');
const usernameInput = document.querySelector('#username-input');
const usernameError = document.querySelector('#username-error');
const accountnameInput = document.querySelector('#accountname-input');
const accountnameError = document.querySelector('#accountname-error');
const introInput = document.querySelector('#intro-input');
const saveButton = document.querySelector('#save-button');

const usernameValidator = new InputValidator()
  .minLength(2, USERNAME.minLength)
  .maxLength(10, USERNAME.maxLength)
  .notMatch(REGEX.spaces, USERNAME.noSpaces);

const accountnameValidator = new InputValidator()
  .minLength(1, ACCOUNTNAME.length)
  .match(REGEX.accountname, ACCOUNTNAME.wrongPattern);

let prevImage;
let prevUsername;
let prevAccountname;
let prevIntro;
let isUsernameValid = true;
let isAccountnameValid = true;

(async function printPrevProfile() {
  const { ok, user, error } = await getMyInfo();

  if (ok) {
    prevImage = attachImageURL({ src: user.image, ...IMAGE.size.user.lg });
    prevUsername = user.username;
    prevAccountname = user.accountname;
    prevIntro = user.intro;

    imagePreview.src = prevImage;
    usernameInput.value = prevUsername;
    accountnameInput.value = prevAccountname;
    introInput.value = prevIntro;

    saveCurrentPageURL();
  } else {
    alert(error);
    navigate({ goBack: true, replace: true });
  }
})();

StatusBar();

imageInput.addEventListener('change', async ({ target: { files } }) => {
  const { isValid, cause } = validateImageFiles(files);

  if (isValid) {
    const imageSrc = await getImageDataURL(files[0]);
    imagePreview.src = imageSrc;
  } else alert(cause);

  activateSaveButton();
});

usernameInput.addEventListener(
  'input',
  debounce(({ target: { value: username } }) => {
    const { isValid, cause } = validateUsername(username);

    isUsernameValid = isValid;
    usernameError.textContent = cause;

    activateSaveButton();
  }, 300),
);

accountnameInput.addEventListener(
  'input',
  promisedDebounce(async ({ target: { value: accountname } }) => {
    const { isValid, cause, error } = await validateAccountname(accountname);

    if (error) return alert(error);

    isAccountnameValid = isValid;
    accountnameError.textContent = cause;

    activateSaveButton();
  }, 300),
);

introInput.addEventListener('input', () => {
  activateSaveButton();
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!isSubmitable()) return alert(REGISTER.requireValidation);

  let image;

  if (imageInput.value) {
    const { ok, filename, error } = await getImageFileName(imageInput.files[0]);

    if (!ok) return alert(error);
    image = filename;
  }

  const user = {
    image,
    username: usernameInput.value,
    accountname: accountnameInput.value,
    intro: introInput.value,
  };

  const { ok, error } = await modifyProfile(user);

  if (ok) navigate({ to: PAGE.profile(), replace: true });
  else alert(error);
});

function validateUsername(username) {
  if (username === prevUsername) return { isValid: true };

  const { isValid, cause } = usernameValidator.validate(username);

  return { isValid, cause };
}

async function validateAccountname(accountname) {
  if (accountname === prevAccountname) return { isValid: true };

  const result = accountnameValidator.validate(accountname);

  if (!result.isValid) return { isValid: result.isValid, cause: result.cause };

  const { ok, message, error } = await checkIsAccountnameAvailable(accountname);

  if (!ok) return { error: error.message };

  if (message !== ACCOUNTNAME.available)
    return { isValid: false, cause: message };
  else return { isValid: true };
}

function isSubmitable() {
  const isSameImage = imagePreview.src === prevImage;
  const isSameUsername = usernameInput.value === prevUsername;
  const isSameAccountname = accountnameInput.value === prevAccountname;
  const isSameIntro = introInput.value === prevIntro;

  const areSameValuesWithPrev =
    isSameUsername && isSameAccountname && isSameImage && isSameIntro;
  const areNamesValid = isUsernameValid && isAccountnameValid;

  if (!areSameValuesWithPrev && areNamesValid) return true;
  else return false;
}

function activateSaveButton() {
  saveButton.disabled = !isSubmitable();
}
