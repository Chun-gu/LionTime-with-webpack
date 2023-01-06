import './style.css';

import defaultProductImage from '@images/default-post-product-image.webp';

import { getProduct } from '@api';
import { BottomSheet } from '@components';
import { getFromQueryString, trimImageURL } from '@utils';

const productMenuButton = document.querySelector('.product-menu-button');
const productImage = document.querySelector('#product-image');
const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const productLink = document.querySelector('#product-link');

const productId = getFromQueryString('productId');
const myId = sessionStorage.getItem('my-id');

initializePage();

productMenuButton.addEventListener('click', () => {
  new BottomSheet({ type: 'product', productId }).open();
});

async function initializePage() {
  const {
    ok,
    product: {
      itemImage,
      itemName,
      price,
      link,
      author: { _id: authorId },
    },
    error,
  } = await getProduct(productId);

  if (ok) {
    const img = document.createElement('img');
    img.src = trimImageURL(itemImage);
    img.alt = '상품 이미지';
    img.onerror = ({ target }) => {
      target.onerror = null;
      target.src = defaultProductImage;
    };

    productImage.append(img);
    productName.textContent = itemName;
    productPrice.textContent = price.toLocaleString() + '원';
    productLink.href = 'https://' + link;
    productLink.textContent = link;

    if (myId === authorId) productMenuButton.classList.toggle('hidden');
  } else {
    alert(error);
    history.back();
  }
}
