import styles from './style.module.css';

import defaultPostProductImage from '@images/default-post-product-image.webp';

import Image from '../Image';

export default function ImageSlide(imgSrc) {
  const ImageSlide = document.createElement('li');
  ImageSlide.classList.add(styles['image-slide']);

  const slideImage = Image({
    src: imgSrc,
    alt: '업로드 이미지',
    fallback: defaultPostProductImage,
  });

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add(styles['delete-button']);

  ImageSlide.append(slideImage);
  ImageSlide.append(deleteButton);

  return ImageSlide;
}
