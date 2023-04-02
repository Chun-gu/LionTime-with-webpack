import styles from './style.module.css';

import defaultPostProductImage from '@images/default-post-product-image.webp';

import { PAGE } from '@constants';

import Image from '../Image';

export default function ProductItem({ product, isAboveTheFold }) {
  const { id: productId, itemImage, itemName, price } = product;

  const li = document.createElement('li');
  li.classList.add(styles['product-item'], 'product-item');
  li.dataset.productId = productId;

  const a = document.createElement('a');
  a.href = PAGE.product(productId);

  const img = Image({
    src: itemImage,
    alt: '상품 이미지',
    shouldLazy: !isAboveTheFold,
    fallback: defaultPostProductImage,
  });
  img.classList.add(styles['product-img']);

  const p = document.createElement('p');
  p.classList.add(styles['product-name']);
  p.textContent = itemName;

  const span = document.createElement('span');
  span.classList.add(styles['product-price']);
  span.textContent = `${price.toLocaleString()}원`;

  a.append(img);
  a.append(p);
  a.append(span);
  li.append(a);

  return li;
}
