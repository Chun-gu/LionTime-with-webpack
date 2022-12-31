import './style.css';

import { searchUser } from '@api';
import { NoSearchResult, StatusBar, UserProfileCard } from '@components';
import { promisedDebounce } from '@utils';

const searchBar = document.querySelector('#search-bar');
const resultList = document.querySelector('#search-result-list');

let keyword = '';

StatusBar();

searchBar.addEventListener('input', async (e) => {
  const searchResult = await getSearchResult(e.target.value);
  printSearchResult(searchResult);
});

const getSearchResult = promisedDebounce(async (value) => {
  keyword = value.replaceAll(/\s+/g, '');

  if (!keyword) return (resultList.innerHTML = '');

  const { ok, users, error } = await searchUser(keyword);

  if (ok) return users;
  else return alert(error);
}, 300);

function printSearchResult(result = []) {
  resultList.innerHTML = '';

  if (result.length === 0) {
    resultList.append(NoSearchResult());
    return;
  }

  for (const user of result) {
    resultList.append(UserProfileCard({ user, keyword }));
  }
}
