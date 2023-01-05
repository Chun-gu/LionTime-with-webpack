import './style.css';

import { postProduct, getImageFileName } from '@api';
import { PRODUCT_MESSAGE, REGEX } from '@constants';
import { ProductPreview, StatusBar } from '@components';
import { validateImageFiles } from '@utils';

StatusBar();

const productForm = document.querySelector('#product-form');
const previewSection = document.querySelector('#preview-section');
const imageInput = document.querySelector('#image-input');
const nameInput = document.querySelector('#name-input');
const priceInput = document.querySelector('#price-input');
const linkInput = document.querySelector('#link-input');
const submitButton = document.querySelector('#submit-button');

imageInput.addEventListener('change', async ({ target: { files } }) => {
  const { isValid, cause } = validateImageFiles(files);

  if (isValid) {
    previewSection.append(await ProductPreview(files[0]));
  } else alert(cause);
});

previewSection.addEventListener('click', ({ target }) => {
  if (target.classList.contains('delete-button')) {
    const productPreview = document.querySelector('.product-preview');
    productPreview.remove();
    imageInput.value = '';
  }
});

function validateInputs() {
  return (
    imageInput.value &&
    nameInput.value &&
    priceInput.value &&
    REGEX.url.test(linkInput.value)
  );
}

document.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    const isValid = validateInputs();

    if (isValid) submitButton.disabled = false;
    else submitButton.disabled = true;
  });
});

productForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const isValid = validateInputs();

  if (!isValid) return;

  const imageFileName = await getImageFileName(imageInput.files[0]);

  if (!imageFileName.ok) return alert(imageFileName.error);

  const product = {
    itemName: nameInput.value,
    price: Number(priceInput.value),
    link: linkInput.value,
    itemImage: imageFileName.filename,
  };

  const { ok, productId, error } = await postProduct(product);

  if (ok) location.href = `product?productId=${productId}`;
  else alert(error);
});
