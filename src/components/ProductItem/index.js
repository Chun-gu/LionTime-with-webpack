import styles from './style.module.css';

import { PAGE } from '@constants';
import { trimImageURL } from '@utils';

import defaultPostProductImage from '@images/default-post-product-image.webp';

export default function ProductItem(product) {
  const { id: productId, itemImage, itemName, price } = product;

  const li = document.createElement('li');
  li.classList.add(styles['product-item'], 'product-item');
  li.dataset.productId = productId;

  const a = document.createElement('a');
  a.href = PAGE.product(productId);

  const img = document.createElement('img');
  img.src = trimImageURL(itemImage);
  img.setAttribute('loading', 'lazy');
  img.onerror = ({ target }) => {
    target.onerror = null;
    target.src = defaultPostProductImage;
  };
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
