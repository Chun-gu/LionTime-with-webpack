import styles from './style.module.css';

import defaultPostProductImage from '@images/default-post-product-image.webp';
import defaultProfileImageSmall from '@images/default-profile-image-small.webp';

import { PAGE } from '@constants';
import { trimImageURL } from '@utils';

export function PostItem(post, page) {
  const {
    id: postId,
    author: { image: authorImg, username, accountname },
    content,
    image,
    heartCount,
    hearted,
    commentCount,
    createdAt,
  } = post;

  const postItem = document.createElement('div');
  postItem.classList.add('post-card', styles['post-item']);
  postItem.dataset.postId = postId;
  postItem.dataset.author = accountname;

  const leftDiv = document.createElement('div');
  postItem.append(leftDiv);

  const authorImage = document.createElement(page === 'profile' ? 'div' : 'a');
  if (authorImage.tagName === 'A') authorImage.href = PAGE.profile(accountname);
  authorImage.classList.add(styles['post-author-image']);
  leftDiv.append(authorImage);

  const img = document.createElement('img');
  img.src = trimImageURL(authorImg);
  img.alt = '작성자 프로필 이미지';
  img.setAttribute('loading', 'lazy');
  img.onerror = ({ target }) => {
    target.onerror = null;
    target.src = defaultProfileImageSmall;
  };
  authorImage.append(img);

  const rightDiv = document.createElement('div');
  postItem.append(rightDiv);

  const authorInfo = document.createElement('div');
  authorInfo.classList.add(styles['post-author-info']);
  rightDiv.append(authorInfo);

  const author = document.createElement(page === 'profile' ? 'span' : 'a');
  author.classList.add(styles['post-author'], 'single-ellipsis');
  author.textContent = username;
  if (author.tagName === 'A') author.href = PAGE.profile(accountname);
  authorInfo.append(author);

  const authorId = document.createElement('small');
  authorId.classList.add(styles['post-author-id']);
  authorId.textContent = `@ ${accountname}`;
  authorInfo.append(authorId);

  const postText = document.createElement('p');
  postText.classList.add(styles['post-content']);
  postText.dataset.postId = postId;
  postText.textContent = content;
  rightDiv.append(postText);

  if (image) {
    const postImage = document.createElement(page === 'post' ? 'div' : 'a');
    if (postImage.tagName === 'A') postImage.href = PAGE.post(postId);
    postImage.classList.add(styles['post-image']);
    rightDiv.append(postImage);

    const img = document.createElement('img');
    img.src = trimImageURL(image.split(',')[0]);
    img.alt = '게시글 이미지';
    img.setAttribute('loading', 'lazy');
    img.onerror = ({ target }) => {
      target.src = defaultPostProductImage;
    };
    postImage.append(img);
  }

  const utils = document.createElement('div');
  utils.classList.add(styles['post-utils']);
  rightDiv.append(utils);

  const heartButton = document.createElement('button');
  heartButton.classList.add('heart-button', styles['heart-button']);
  heartButton.dataset.hearted = hearted;
  utils.append(heartButton);

  const heartDesc = document.createElement('span');
  heartDesc.classList.add('sr-only');
  heartDesc.textContent = '좋아요';
  heartButton.append(heartDesc);

  const heartCounts = document.createElement('span');
  heartCounts.classList.add(styles['heart-count']);
  heartCounts.textContent = heartCount;
  utils.append(heartCounts);

  const commentButton = document.createElement(
    page === 'post' ? 'button' : 'a',
  );
  commentButton.classList.add('comment-button', styles['comment-button']);
  if (commentButton.tagName === 'BUTTON') {
    commentButton.dataset.postId = postId;
    commentButton.disabled = page === 'post';
  } else if (commentButton.tagName === 'A') {
    commentButton.href = PAGE.post(postId);
  }
  utils.append(commentButton);

  const commentDesc = document.createElement('span');
  commentDesc.classList.add('sr-only');
  commentDesc.textContent = '댓글';
  commentButton.append(commentDesc);

  const commentCounts = document.createElement('span');
  commentCounts.classList.add(styles['comment-count']);
  commentCounts.textContent = commentCount;
  utils.append(commentCounts);

  const date = document.createElement('span');
  date.classList.add(styles['post-date']);
  date.textContent = new Intl.DateTimeFormat('kr', {
    dateStyle: 'long',
  }).format(new Date(createdAt));
  rightDiv.append(date);

  const menuButton = document.createElement('button');
  menuButton.id = 'menuButton';
  menuButton.classList.add('post-menu-button', styles['post-menu-button']);
  postItem.append(menuButton);

  const menuDesc = document.createElement('span');
  menuDesc.classList.add('sr-only');
  menuDesc.textContent = '게시글 메뉴 열기';
  menuButton.append(menuDesc);

  return postItem;
}

export function PostAlbumItem(post) {
  const { id: postId, image } = post;

  const albumItem = document.createElement('li');
  albumItem.classList.add('post-album-item');

  const a = document.createElement('a');
  a.href = PAGE.post(postId);
  a.classList.add(styles['post-album-item']);
  a.dataset.postId = postId;

  const albumImg = document.createElement('img');
  albumImg.setAttribute('src', trimImageURL(image));
  albumImg.setAttribute('loading', 'lazy');

  const images = image.split(',');
  if (images.length) albumImg.src = trimImageURL(images[0]);
  albumImg.onerror = `this.src='${defaultPostProductImage}'`;
  albumImg.classList.add(styles['post-album-image']);
  a.append(albumImg);

  if (images.length > 1) {
    const multiIcon = document.createElement('div');
    multiIcon.classList.add(styles['icon-multi-image']);
    a.append(multiIcon);
  }

  albumItem.append(a);

  return albumItem;
}
