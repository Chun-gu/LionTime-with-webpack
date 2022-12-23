import styles from './style.module.css';

import { POST_MESSAGE } from '@constants';

export default function NoPost() {
  const noPost = document.createElement('li');
  noPost.classList.add(styles['no-feed']);
  noPost.textContent = POST_MESSAGE.noPost;

  return noPost;
}
