import styles from './style.module.css';

import { PAGE } from '@constants';
import logoLionGrey from '@images/logo-lion-grey.webp';

export default function NoFeed() {
  const noFeed = document.createElement('li');
  noFeed.classList.add(styles['no-feed']);

  const img = document.createElement('img');
  img.classList.add(styles['logo']);
  img.src = logoLionGrey;
  img.setAttribute('alt', '라이언 타임 로고');

  const span = document.createElement('span');
  span.classList.add(styles['follow-suggestion']);
  span.textContent = '유저를 검색해 팔로우 해보세요!';

  const a = document.createElement('a');
  a.classList.add(styles['search-button']);
  a.href = PAGE.search;
  a.textContent = '검색하기';

  noFeed.append(img);
  noFeed.append(span);
  noFeed.append(a);

  return noFeed;
}
