import styles from './style.module.css';

export default function ProductPreview(image) {
  const productPreview = document.createElement('div');
  productPreview.classList.add('product-preview', styles['product-preview']);

  const previewImage = document.createElement('img');
  previewImage.classList.add(styles['preview-image']);
  previewImage.src = image;
  previewImage.alt = '업로드 이미지';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add('delete-button', styles['delete-button']);

  productPreview.append(previewImage);
  productPreview.append(deleteButton);

  return productPreview;
}
