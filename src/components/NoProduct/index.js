import styles from './style.module.css';

import { PRODUCT_MESSAGE } from '@constants';

export default function NoProduct() {
  const noProduct = document.createElement('li');
  noProduct.classList.add(styles['no-product']);
  noProduct.textContent = PRODUCT_MESSAGE.noProduct;

  return noProduct;
}
