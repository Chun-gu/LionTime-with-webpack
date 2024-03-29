import styles from './style.module.css';

import defaultProfileImageSmall from '@images/default-profile-image-small.webp';

import { IMAGE, PAGE } from '@constants';
import { relativeDateTo } from '@utils';

import Image from '../Image';

export default function Comment(data) {
  const {
    author: { accountname, username, image },
    content,
    createdAt,
    id,
  } = data;

  const comment = document.createElement('li');
  comment.classList.add('comment', styles['comment-list-item']);
  comment.dataset.commentId = id;
  comment.dataset.author = accountname;

  const profileLink = document.createElement('a');
  profileLink.classList.add(styles['profile']);
  profileLink.href = PAGE.profile(accountname);

  const profileImage = Image({
    src: image,
    alt: accountname,
    fallback: defaultProfileImageSmall,
    ...IMAGE.size.user.xs,
  });

  const div = document.createElement('div');

  const authorLink = document.createElement('a');
  authorLink.classList.add(styles['author']);
  authorLink.href = PAGE.profile(accountname);

  const author = document.createElement('span');
  author.textContent = username;

  const time = document.createElement('small');
  time.classList.add(styles['time']);
  time.textContent = relativeDateTo(createdAt);

  const contentParagraph = document.createElement('p');
  contentParagraph.classList.add(styles['content']);
  contentParagraph.textContent = content;

  const menuButton = document.createElement('button');
  menuButton.classList.add(
    'menu-button',
    styles['comment-menu-button'],
    'comment-menu-button',
  );

  const desc = document.createElement('span');
  desc.classList.add('sr-only');
  desc.textContent = '댓글 메뉴 열기';

  profileLink.append(profileImage);
  authorLink.append(author);
  div.append(authorLink);
  div.append(time);
  div.append(contentParagraph);
  menuButton.append(desc);
  comment.append(profileLink);
  comment.append(div);
  comment.append(menuButton);

  return comment;
}
