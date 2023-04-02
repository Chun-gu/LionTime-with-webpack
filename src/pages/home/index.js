import './style.css';

import { getFeed, heartPost, unheartPost } from '@api';
import { PostItem, NoFeed, StatusBar } from '@components';
import { intersectionObserver, saveCurrentPageURL } from '@utils';

const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');

let BottomSheet;

const LIMIT = 5;
let skip = 0;

const feedList = document.querySelector('.feed-list');
const feedListObserver = intersectionObserver(feedList);

StatusBar();
printFeed();
saveCurrentPageURL();

feedList.addEventListener('intersect', printFeed);

feedList.addEventListener('mouseover', importBottomSheet);

feedList.addEventListener('click', async ({ target }) => {
  const targetClassList = target.classList;

  if (targetClassList.contains('post-menu-button')) {
    const postId = target.closest('.post-card').dataset.postId;
    const isMine =
      target.closest('.post-card').dataset.author === MY_ACCOUNTNAME;

    new BottomSheet({ type: 'post', postId, isMine }).open();
  }

  if (targetClassList.contains('heart-button')) {
    const postId = target.closest('.post-card').dataset.postId;
    const heartCount = target.nextElementSibling;
    const isHearted = JSON.parse(target.dataset.hearted);

    const { ok, error } = isHearted
      ? await unheartPost(postId)
      : await heartPost(postId);

    if (ok) {
      target.dataset.hearted = !isHearted;
      heartCount.textContent =
        parseInt(heartCount.textContent) + (isHearted ? -1 : 1);
    } else {
      alert(error);
    }
  }
});

async function printFeed() {
  const { ok, posts, error } = await getFeed(LIMIT, skip);

  if (!ok) return alert(error.message);

  if (posts.length === 0) {
    if (skip === 0) return appendNoFeed();

    feedListObserver.disconnect();
    feedList.removeEventListener('intersect', printFeed);
  } else if (posts.length < LIMIT) {
    appendPosts(posts);
    feedListObserver.disconnect();
    feedList.removeEventListener('intersect', printFeed);
  } else {
    skip += LIMIT;
    appendPosts(posts);
    feedListObserver.observe(feedList.lastChild);
  }
}

function appendNoFeed() {
  feedList.append(NoFeed());
}

function appendPosts(posts) {
  posts.forEach((post) => {
    feedList.append(
      PostItem({ post, page: 'home', isAboveTheFold: skip <= LIMIT }),
    );
  });
}

async function importBottomSheet(event) {
  if (event.target.classList.contains('menu-button')) {
    const module = await import(
      /* webpackChunkName: "BottomSheet" */ '@components/BottomSheet'
    );
    BottomSheet = module.default;

    feedList.removeEventListener('mouseover', importBottomSheet);
  }
}
