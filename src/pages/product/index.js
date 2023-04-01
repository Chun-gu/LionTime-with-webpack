import './style.css';

import defaultProductImage from '@images/default-post-product-image.webp';

import { getProduct } from '@api';
import { Image } from '@components';
import { getFromQueryString, navigate, saveCurrentPageURL } from '@utils';

const productMenuButton = document.querySelector('.product-menu-button');
const productImage = document.querySelector('#product-image');
const productName = document.querySelector('#product-name');
const productPrice = document.querySelector('#product-price');
const productLink = document.querySelector('#product-link');

const productId = getFromQueryString('productId');
const myId = sessionStorage.getItem('my-id');

let BottomSheet;

initializePage();

productMenuButton.addEventListener('mouseover', importBottomSheet);

productMenuButton.addEventListener('click', () => {
  new BottomSheet({ type: 'product', productId }).open();
});

async function initializePage() {
  const { ok, product, error } = await getProduct(productId);

  if (ok) {
    const {
      itemImage,
      itemName,
      price,
      link,
      author: { _id: authorId },
    } = product;

    const img = Image({
      src: itemImage,
      alt: '상품 이미지',
      fallback: defaultProductImage,
    });

    productImage.append(img);
    productName.textContent = itemName;
    productPrice.textContent = price.toLocaleString() + '원';
    productLink.href = 'https://' + link;
    productLink.textContent = link;

    if (myId === authorId) productMenuButton.classList.toggle('hidden');

    saveCurrentPageURL();
  } else {
    alert(error);
    navigate({ goBack: true, replace: true });
  }
}

async function importBottomSheet() {
  const module = await import(
    /* webpackChunkName: "BottomSheet" */ '@components/BottomSheet'
  );
  BottomSheet = module.default;

  productMenuButton.removeEventListener('mouseover', importBottomSheet);
}
