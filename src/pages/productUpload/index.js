import './style.css';

import { getImageFileName, getProduct, postProduct, updateProduct } from '@api';
import { ProductPreview, StatusBar } from '@components';
import { PAGE, PRODUCT_ERROR, REGEX } from '@constants';
import {
  attachImageURL,
  debounce,
  getFromQueryString,
  getImageDataURL,
  InputValidator,
  navigate,
  saveCurrentPageURL,
  validateImageFiles,
} from '@utils';

const productId = getFromQueryString('productId');
const isUpdating = !!productId;

const productForm = document.querySelector('#product-form');
const previewSection = document.querySelector('#preview-section');
const imageInput = document.querySelector('#image-input');
const nameInput = document.querySelector('#name-input');
const nameErrorMessage = document.querySelector('#name-error-message');
const priceInput = document.querySelector('#price-input');
const priceErrorMessage = document.querySelector('#price-error-message');
const linkInput = document.querySelector('#link-input');
const linkErrorMessage = document.querySelector('#link-error-message');

const submitButton = document.querySelector('#submit-button');

const nameValidator = new InputValidator()
  .required(PRODUCT_ERROR.nameRequired)
  .minLength(2, PRODUCT_ERROR.nameMinLength)
  .maxLength(15, PRODUCT_ERROR.nameMaxLength);
const priceValidator = new InputValidator()
  .required(PRODUCT_ERROR.priceRequired)
  .number(PRODUCT_ERROR.priceShouldBeNumber);
const linkValidator = new InputValidator()
  .required(PRODUCT_ERROR.linkRequired)
  .match(REGEX.url, PRODUCT_ERROR.linkPattern);

let prevImage;
let prevName;
let prevPrice;
let prevLink;

let isImageValid = false;
let isNameValid = false;
let isPriceValid = false;
let isLinkValid = false;

StatusBar();

if (isUpdating) printPrevProduct(productId);
else saveCurrentPageURL();

imageInput.addEventListener('change', async ({ target: { files } }) => {
  const { isValid, cause } = validateImageFiles(files);

  if (isValid) {
    const imageDataURL = await getImageDataURL(files[0]);
    previewSection.append(ProductPreview(imageDataURL));
  } else alert(cause);

  isImageValid = isValid;
  toggleSubmitButton();
});

previewSection.addEventListener('click', ({ target }) => {
  if (target.classList.contains('delete-button')) {
    const productPreview = document.querySelector('.product-preview');
    productPreview.remove();
    imageInput.value = '';

    isImageValid = false;
    toggleSubmitButton();
  }
});

nameInput.addEventListener(
  'input',
  debounce(({ target: { value: name } }) => {
    const { isValid, cause } = nameValidator.validate(name);

    isNameValid = isValid;
    nameErrorMessage.textContent = cause;
    toggleSubmitButton();
  }, 300),
);

priceInput.addEventListener(
  'input',
  debounce(({ target: { value: price } }) => {
    const { isValid, cause } = priceValidator.validate(price);

    isPriceValid = isValid;
    priceErrorMessage.textContent = cause;

    toggleSubmitButton();
  }, 300),
);

linkInput.addEventListener(
  'input',
  debounce(({ target: { value: link } }) => {
    const { isValid, cause } = linkValidator.validate(link);

    isLinkValid = isValid;
    linkErrorMessage.textContent = cause;
    toggleSubmitButton();
  }, 300),
);

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!canSubmit()) return;

  const product = {
    itemName: nameInput.value,
    price: Number(priceInput.value),
    link: linkInput.value,
    itemImage: prevImage,
  };

  if (imageInput.files[0]) {
    const { ok, filename, error } = await getImageFileName(imageInput.files[0]);

    if (ok) product.itemImage = filename;
    else return alert(error);
  }

  const result = isUpdating
    ? await updateProduct(productId, product)
    : await postProduct(product);

  if (result.ok)
    navigate({
      to: PAGE.product(result.productId),
      replace: true,
    });
  else alert(result.error);
});

async function printPrevProduct(productId) {
  const { ok, product, error } = await getProduct(productId);

  if (ok) {
    prevImage = product.itemImage;
    prevName = product.itemName;
    prevPrice = product.price;
    prevLink = product.link;

    isImageValid = true;
    isNameValid = true;
    isPriceValid = true;
    isLinkValid = true;

    previewSection.append(ProductPreview(attachImageURL(prevImage)));
    nameInput.value = product.itemName;
    priceInput.value = product.price;
    linkInput.value = product.link;

    saveCurrentPageURL();
  } else {
    alert(error);
    navigate({ goBack: true, replace: true });
  }
}

function canSubmit() {
  const imagePreview = document.querySelector('.product-preview img');
  const isSameImage = imagePreview?.src === prevImage;
  const isSameName = nameInput.value === prevName;
  const isSamePrice = priceInput.value === prevPrice;
  const isSameLink = linkInput.value === prevLink;

  const areSameValuesWithPrev =
    isSameImage && isSameName && isSamePrice && isSameLink;

  const areValuesValid =
    isImageValid && isNameValid && isPriceValid && isLinkValid;

  if (!areSameValuesWithPrev && areValuesValid) return true;
  return false;
}

function toggleSubmitButton() {
  submitButton.disabled = !canSubmit();
}
