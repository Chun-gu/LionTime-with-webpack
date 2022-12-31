import styles from './style.module.css';

export default function NoSearchResult() {
  const noSearchResult = document.createElement('li');
  noSearchResult.classList.add(styles['no-result']);

  const span = document.createElement('span');
  span.textContent = '검색 결과가 없습니다.';

  noSearchResult.append(span);

  return noSearchResult;
}
