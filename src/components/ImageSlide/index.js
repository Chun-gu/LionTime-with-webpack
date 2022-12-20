import styles from './style.module.css';

const IMAGE_URL = process.env.IMAGE_URL;
const BASE64_PATTERN = /base64/;

export default function ImageSlide(imgSrc) {
  const isBase64 = BASE64_PATTERN.test(imgSrc);

  const ImageSlide = document.createElement('li');
  ImageSlide.classList.add(styles['image-slide']);

  const slideImage = document.createElement('img');
  slideImage.src = (isBase64 ? '' : IMAGE_URL) + imgSrc;
  slideImage.alt = '업로드 이미지';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.classList.add(styles['delete-button']);

  ImageSlide.append(slideImage);
  ImageSlide.append(deleteButton);

  return ImageSlide;
}
