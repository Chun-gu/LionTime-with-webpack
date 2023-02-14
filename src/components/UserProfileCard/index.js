import styles from './style.module.css';

import defaultProfileImageSmall from '@images/default-profile-image-small.webp';

import { PAGE } from '@constants';
import { trimImageURL } from '@utils';

export default function UserProfileCard({ user, keyword, myId }) {
  let { _id: id, username, accountname, image, follower } = user;

  const userProfileCard = document.createElement('li');
  userProfileCard.classList.add(styles['user-profile-card']);
  userProfileCard.dataset.accountname = accountname;

  const a = document.createElement('a');
  a.classList.add(styles['link']);
  a.href = PAGE.profile(accountname);
  userProfileCard.append(a);

  const img = document.createElement('img');
  img.classList.add(styles['profile-image']);
  img.src = trimImageURL(image);
  img.alt = `${username}의 프로필 사진`;
  img.onerror = ({ target }) => {
    target.onerror = null;
    target.src = defaultProfileImageSmall;
  };
  a.append(img);

  const div = document.createElement('div');
  div.classList.add(styles['names-wrapper']);
  a.append(div);

  if (keyword) {
    const keywordPattern = new RegExp(keyword, 'g');
    username = username.replaceAll(
      keywordPattern,
      `<span class=${styles['match-keyword']}>${keyword}</span>`,
    );
    accountname = accountname.replaceAll(
      keywordPattern,
      `<span class=${styles['match-keyword']}>${keyword}</span>`,
    );
  }

  const userName = document.createElement('span');
  userName.classList.add(styles['user-name'], 'single-ellipsis');
  userName.innerHTML = username;
  div.append(userName);

  const accountName = document.createElement('span');
  accountName.classList.add(styles['account-name'], 'single-ellipsis');
  accountName.innerHTML = `@ ${accountname}`;
  div.append(accountName);

  if (myId && myId !== id) {
    const isFollowing = follower.includes(myId);
    const button = document.createElement('button');
    button.classList.add('follow-button', styles['follow-button']);
    button.dataset.isFollowing = isFollowing;
    userProfileCard.append(button);
  }

  return userProfileCard;
}
