import './style.css';

import { getFollowStatus, follow, unfollow } from '@api';
import { StatusBar, UserProfileCard } from '@components';
import {
  getFromQueryString,
  intersectionObserver,
  saveCurrentPageURL,
} from '@utils';

const myId = sessionStorage.getItem('my-id');
const accountname = getFromQueryString('accountname');
const page = getFromQueryString('page');

const userList = document.querySelector('#user-list');
const userListObserver = intersectionObserver(userList);

const LIMIT = 15;
let skip = 0;

StatusBar();
saveCurrentPageURL();
printUsers();

userList.addEventListener('intersect', printUsers);

userList.addEventListener('click', async ({ target }) => {
  if (target.classList.contains('follow-button')) {
    const accountname = target.closest('li').dataset.accountname;
    const isFollowing = JSON.parse(target.dataset.isFollowing);

    const { ok, error } = isFollowing
      ? await unfollow(accountname)
      : await follow(accountname);

    if (ok) target.dataset.isFollowing = !isFollowing;
    else alert(error);
  }
});

async function printUsers() {
  const { ok, users, error } = await getFollowStatus({
    accountname,
    page,
    LIMIT,
    skip,
  });

  if (!ok) return alert(error.message);

  if (users.length === 0) {
    if (skip === 0) userList.textContent = '아무도 없네요...';

    userListObserver.disconnect();
    userList.removeEventListener('intersect', printUsers);
  } else if (users.length < LIMIT) {
    users.forEach((user) => userList.append(UserProfileCard({ user, myId })));
    userListObserver.disconnect();
    userList.removeEventListener('intersect', printUsers);
  } else {
    skip += LIMIT;
    users.forEach((user) => userList.append(UserProfileCard({ user, myId })));
    userListObserver.observe(userList.lastChild);
  }
}
