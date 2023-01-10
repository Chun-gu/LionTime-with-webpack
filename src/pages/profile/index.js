import './style.css';

import {
  follow,
  unfollow,
  getPosts,
  getProducts,
  getProfile,
  heartPost,
  unheartPost,
} from '@api';
import {
  BottomSheet,
  NoPost,
  NoProduct,
  ProductItem,
  PostItem,
  PostAlbumItem,
  ProfileSection,
  StatusBar,
} from '@components';
import {
  getFromQueryString,
  intersectionObserver,
  scrollHorizontal,
} from '@utils';

const MY_ID = sessionStorage.getItem('my-id');
const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const TARGET_ACCOUNTNAME = getFromQueryString('userId') || MY_ACCOUNTNAME;
const isMyProfile = MY_ACCOUNTNAME === TARGET_ACCOUNTNAME;

const profileMenuButton = document.querySelector('.profile-menu-button');
const profileSection = document.querySelector('.profile-section');
const productList = document.querySelector('.product-list');
const postList = document.querySelector('.post-list');
const postAlbum = document.querySelector('.post-album');
const listButton = document.querySelector('.list-button');
const albumButton = document.querySelector('.album-button');

const productListObserver = intersectionObserver(productList);
const postListObserver = intersectionObserver(postList);

const PRODUCT_LIMIT = 5;
let productSkip = 0;
const POST_LIMIT = 9;
let postSkip = 0;

StatusBar();
initializePage();

profileMenuButton.addEventListener('click', () => {
  new BottomSheet({ type: 'header' }).open();
});

profileSection.addEventListener('click', async ({ target }) => {
  if (target.id === 'follow-button') toggleFollow(target);
  if (target.id === 'intro') target.classList.toggle('single-ellipsis');
});

productList.addEventListener('intersect', printProducts);

productList.addEventListener('wheel', (e) => scrollHorizontal(e, productList));

postAlbum.addEventListener('intersect', printPosts);

postList.addEventListener('intersect', printPosts);

postList.addEventListener('click', async ({ target }) => {
  const targetClassList = target.classList;

  if (targetClassList.contains('post-menu-button')) openBottomSheet(target);

  if (targetClassList.contains('heart-button')) toggleHeart(target);

  if (targetClassList.contains('comment-button')) {
    const postId = target.closest('.post-card').dataset.postId;
    location.href = `post?postId=${postId}`;
  }
});

listButton.addEventListener('click', () => {
  listButton.classList.add('selected');
  albumButton.classList.remove('selected');
  postList.classList.remove('hidden');
  postAlbum.classList.add('hidden');
});

albumButton.addEventListener('click', () => {
  listButton.classList.remove('selected');
  albumButton.classList.add('selected');
  postList.classList.add('hidden');
  postAlbum.classList.remove('hidden');
});

async function initializePage() {
  const requests = [
    getProfile(TARGET_ACCOUNTNAME),
    getProducts({
      accountname: TARGET_ACCOUNTNAME,
      LIMIT: PRODUCT_LIMIT,
      skip: productSkip,
    }),
    getPosts({
      accountname: TARGET_ACCOUNTNAME,
      LIMIT: POST_LIMIT,
      skip: postSkip,
    }),
  ];

  const [profile, products, posts] = await Promise.all(requests);

  if (profile.error || products.error || posts.error) {
    return alert(profile.error || products.error || posts.error);
  }

  profileSection.innerHTML = ProfileSection({
    profile: profile.profile,
    myId: MY_ID,
    isMyProfile,
  });

  appendProducts(products.products);
  appendPosts(posts.posts);
}

function appendProducts(products) {
  if (products.length === 0) {
    if (productSkip === 0) productList.append(NoProduct());
    productListObserver.disconnect();
    productList.removeEventListener('intersect', printProducts);
  } else if (products.length < PRODUCT_LIMIT) {
    products.forEach((product) => productList.append(ProductItem(product)));
    productListObserver.disconnect();
    productList.removeEventListener('intersect', printProducts);
  } else {
    productSkip += PRODUCT_LIMIT;
    products.forEach((product) => productList.append(ProductItem(product)));
    productListObserver.observe(productList.lastChild);
  }
}

async function printProducts() {
  const { ok, products, error } = await getProducts({
    accountname: TARGET_ACCOUNTNAME,
    LIMIT: PRODUCT_LIMIT,
    skip: productSkip,
  });

  if (ok) appendProducts(products);
  else alert(error);
}

function appendPosts(posts) {
  if (posts.length === 0) {
    if (postSkip === 0) {
      postList.append(NoPost());
      postAlbum.append(NoPost());
    }
    postListObserver.disconnect();
    postList.removeEventListener('intersect', printPosts);
    postAlbum.removeEventListener('intersect', printPosts);
  } else if (posts.length < POST_LIMIT) {
    posts.forEach((post) => {
      postList.append(PostItem(post, 'profile'));
      if (post.image) postAlbum.append(PostAlbumItem(post));
    });
    postListObserver.disconnect();
    postList.removeEventListener('intersect', printPosts);
    postAlbum.removeEventListener('intersect', printPosts);
  } else {
    postSkip += POST_LIMIT;
    posts.forEach((post) => {
      postList.append(PostItem(post, 'profile'));
      if (post.image) postAlbum.append(PostAlbumItem(post));
    });
    postListObserver.observe(postList.lastChild);
    postListObserver.observe(postAlbum.lastChild);
  }
}

async function printPosts() {
  const { ok, posts, error } = await getPosts({
    accountname: TARGET_ACCOUNTNAME,
    LIMIT: POST_LIMIT,
    skip: postSkip,
  });

  if (ok) appendPosts(posts);
  else alert(error);
}

async function toggleFollow(target) {
  const isFollowing = JSON.parse(target.dataset.isFollowing);

  const { ok, error } = isFollowing
    ? await unfollow(TARGET_ACCOUNTNAME)
    : await follow(TARGET_ACCOUNTNAME);

  if (ok) {
    target.textContent = isFollowing ? '팔로우' : '언팔로우';
    target.dataset.isFollowing = !isFollowing;
  } else alert(error);
}

async function toggleHeart(target) {
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
  } else alert(error);
}

function openBottomSheet(target) {
  const postId = target.closest('.post-card').dataset.postId;
  const isMine = target.closest('.post-card').dataset.author === MY_ACCOUNTNAME;

  new BottomSheet({ type: 'post', postId, isMine }).open();
}
