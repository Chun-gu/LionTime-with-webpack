import styles from './style.module.css';

import { PRODUCT_ERROR } from '@constants';

export default function NoProduct() {
  const noProduct = document.createElement('li');
  noProduct.classList.add(styles['no-product']);
  noProduct.textContent = PRODUCT_ERROR.noProduct;

  return noProduct;
}
