import styles from './style.module.css';

import { getImageDataURL } from '@utils';

export default async function ProductPreview(image) {
  const productPreview = document.createElement('div');
  productPreview.classList.add('product-preview', styles['product-preview']);

  const previewImage = document.createElement('img');
  previewImage.classList.add(styles['preview-image']);
  const imageURL = await getImageDataURL(image);
  previewImage.src = imageURL;
  previewImage.alt = '업로드 이미지';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('delete-button', styles['delete-button']);

  productPreview.append(previewImage);
  productPreview.append(deleteButton);

  return productPreview;
}
