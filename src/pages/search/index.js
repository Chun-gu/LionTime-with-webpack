import './style.css';

import { searchUser } from '@api';
import { NoSearchResult, StatusBar, UserProfileCard } from '@components';
import { debounce, intersectionObserver } from '@utils';

const searchBar = document.querySelector('#search-bar');
const resultList = document.querySelector('#search-result-list');

const resultListObserver = intersectionObserver(resultList);

let keyword;
let searchResult;
const LIMIT = 15;
let skip = 0;

StatusBar();

(function loadPreviousResult() {
  keyword = sessionStorage.getItem('search-keyword');
  searchBar.value = keyword;
  searchResult = JSON.parse(sessionStorage.getItem('search-result'));

  if (keyword) printSearchResult();
})();

resultList.addEventListener('intersect', printSearchResult);

searchBar.addEventListener(
  'input',
  debounce(async ({ target: { value } }) => {
    keyword = value.replaceAll(/\s+/g, '');
    sessionStorage.setItem('search-keyword', keyword);

    if (!keyword) return;

    const { ok, users, error } = await searchUser(keyword);

    if (ok) {
      skip = 0;
      searchResult = users;
      resultList.innerHTML = '';
      sessionStorage.setItem('search-result', JSON.stringify(users));
      resultList.addEventListener('intersect', printSearchResult);

      printSearchResult();
    } else return alert(error);
  }, 300),
);

function printSearchResult() {
  const users = searchResult.slice(skip, skip + LIMIT);
  console.log(users);

  if (users.length === 0) {
    if (skip === 0) resultList.append(NoSearchResult());
    resultListObserver.disconnect();
    resultList.removeEventListener('intersect', printSearchResult);
  } else if (users.length < LIMIT) {
    for (const user of users) {
      resultList.append(UserProfileCard({ user, keyword }));
    }
    resultListObserver.disconnect();
    resultList.removeEventListener('intersect', printSearchResult);
  } else {
    skip += LIMIT;
    for (const user of users) {
      resultList.append(UserProfileCard({ user, keyword }));
    }
    resultListObserver.observe(resultList.lastChild);
  }
}
