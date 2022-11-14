import { API_URL } from './key.js';
import { getFromQueryString, trimImageURL } from './lib.js';

const MY_ID = sessionStorage.getItem('my-id');
const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const TOKEN = sessionStorage.getItem('my-token');
const TARGET_ACCOUNTNAME = getFromQueryString('userId');
const isMyProfile = MY_ACCOUNTNAME === TARGET_ACCOUNTNAME;

// API 데이터 가져오기
async function fetchData(endpoint) {
    try {
        const res = await fetch(API_URL + endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (err) {
        alert('데이터를 가져오는 데에 실패했습니다.');
    }
}

//  본인 프로필인지 남의 프로필인지 확인해서 분기
if (isMyProfile) {
    const othersUtil = document.querySelector('.profile-utils-others');
    othersUtil.remove();
} else {
    const myUtil = document.querySelector('.profile-utils-mine');
    myUtil.remove();
}

// 프로필 정보 출력하기
(async function printProfile() {
    const endpoint = `/profile/${TARGET_ACCOUNTNAME}`;
    const data = await fetchData(endpoint);
    if (data.message === '해당 계정이 존재하지 않습니다.') {
        alert(data.message);
        history.back();
        return;
    }
    const {
        username,
        accountname,
        intro,
        image,
        follower,
        followerCount,
        followingCount,
    } = data.profile;

    const profileImg = document.querySelector('.profile-img');
    const followersNum = document.querySelector('.followers-num');
    const followingNum = document.querySelector('.followings-num');
    const userName = document.querySelector('.user-name');
    const userId = document.querySelector('.user-id');
    const userIntro = document.querySelector('.user-intro');
    const followBtn = document.querySelector('.btn-follow');
    if (!isMyProfile) {
        const chatBtn = document.querySelector('.btn-chat');
        chatBtn.href = `./chatRoom.html?userId=${accountname}`;
    }

    profileImg.setAttribute('src', trimImageURL(image));
    followersNum.textContent = `${followerCount}`;
    followingNum.textContent = `${followingCount}`;
    userName.textContent = username;
    userId.textContent = `@ ${accountname}`;
    userIntro.textContent = intro;

    if (followBtn) {
        followBtn.dataset.accountname = accountname;
        if (follower.includes(MY_ID)) {
            followBtn.classList.add('following');
            followBtn.textContent = '언팔로우';
        } else {
            followBtn.textContent = '팔로우';
        }
    }
})();

// 판매 중인 상품 출력
const productList = document.querySelector('.product-list');
const productLimit = 5;
let productSkip = 0;

async function getProductData() {
    const endpoint = `/product/${TARGET_ACCOUNTNAME}/?limit=${productLimit}&skip=${productSkip}`;
    const data = await fetchData(endpoint);
    const productData = data.product;
    productSkip += productLimit;
    return productData;
}

function makeProductItem(product) {
    const { id: productId, itemImage, itemName, link, price } = product;

    const li = document.createElement('li');
    li.classList.add('product-item');
    li.dataset.link = link;
    li.dataset.productId = productId;
    const img = document.createElement('img');
    img.setAttribute('src', trimImageURL(itemImage));
    img.setAttribute(
        'onError',
        "this.src='../images/default-post-product-image.png'"
    );
    img.classList.add('product-img');
    const p = document.createElement('p');
    p.classList.add('product-name');
    p.textContent = itemName;
    const span = document.createElement('span');
    span.classList.add('product-price');
    span.textContent = `${price.toLocaleString()}원`;
    li.append(img);
    li.append(p);
    li.append(span);
    return li;
}

function printProductList(productData) {
    for (const product of productData) {
        const productItem = makeProductItem(product);
        productList.appendChild(productItem);
    }
}

// 판매 중인 상품 무한 스크롤
function productIoCb(entries, productIo) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            productIo.unobserve(entry.target);
            const productData = await getProductData();
            if (productData.length === 0) {
                productIo.disconnect();
            } else {
                printProductList(productData);
                observeLastItem(
                    productIo,
                    document.querySelectorAll('.product-item')
                );
            }
        }
    });
}

const productOpt = {
    root: document.querySelector('.product-list'),
    rootMargin: '0px',
    threshold: 1.0,
};

const productIo = new IntersectionObserver(productIoCb, productOpt);

function observeLastItem(productIo, items) {
    const lastItem = items[items.length - 2];
    productIo.observe(lastItem);
}

(async function initProduct() {
    const productData = await getProductData();
    if (productData.length === 0) {
        const product = document.querySelector('.product');
        product.remove();
        return;
    }
    printProductList(productData);
    if (productData.length >= productLimit) {
        observeLastItem(productIo, document.querySelectorAll('.product-item'));
    }
})();

// 게시글 출력
const postList = document.querySelector('.post-list');
const postAlbum = document.querySelector('.post-album');
const postLimit = 9;
let postSkip = 0;

async function getPostData() {
    const endpoint = `/post/${TARGET_ACCOUNTNAME}/userpost/?limit=${postLimit}&skip=${postSkip}`;
    const data = await fetchData(endpoint);
    const postData = data.post;
    postSkip += postLimit;
    return postData;
}

function makePostListItem(post) {
    const {
        id,
        author: { image: authorImg, username, accountname },
        content,
        image,
        heartCount,
        hearted,
        commentCount,
        createdAt,
    } = post;

    const listItem = document.createElement('li');
    listItem.classList.add('post-list-item');
    listItem.dataset.postId = id;

    const authorImage = document.createElement('img');
    authorImage.classList.add('post-author-img');
    authorImage.setAttribute('src', trimImageURL(authorImg));
    authorImage.setAttribute(
        'onerror',
        "this.src='../images/default-profile-img-small.png'"
    );

    const div = document.createElement('div');

    const authorInfo = document.createElement('div');
    authorInfo.classList.add('post-author-info');

    const author = document.createElement('strong');
    author.classList.add('post-author');
    author.textContent = username;

    const authorId = document.createElement('span');
    authorId.classList.add('post-author-id');
    authorId.textContent = `@ ${accountname}`;

    const postText = document.createElement('p');
    postText.classList.add('post-text');
    postText.dataset.postId = id;
    postText.textContent = content;

    const postImg = document.createElement('img');
    postImg.classList.add('post-img');
    postImg.dataset.postId = id;

    const images = image.split(',');
    postImg.setAttribute('src', trimImageURL(images[0]));
    postImg.setAttribute(
        'onerror',
        "this.src='../images/default-post-product-image.png'"
    );

    const utils = document.createElement('div');
    utils.classList.add('post-utils');

    const btnLike = document.createElement('button');
    btnLike.classList.add('btn-like');
    btnLike.dataset.hearted = hearted;

    const likeText = document.createElement('span');
    likeText.classList.add('sr-only');
    likeText.textContent = '좋아요';

    const countLike = document.createElement('span');
    countLike.classList.add('count-like');
    countLike.textContent = heartCount;

    const btnComment = document.createElement('button');
    btnComment.classList.add('btn-comment');
    btnComment.dataset.postId = id;

    const commentText = document.createElement('span');
    commentText.classList.add('sr-only');
    commentText.textContent = '댓글';

    const countComment = document.createElement('span');
    countComment.classList.add('count-comment');
    countComment.textContent = commentCount;

    const date = document.createElement('span');
    date.classList.add('post-date');
    date.textContent = `
    ${createdAt.slice(0, 4)}년
    ${createdAt.slice(5, 7)}월 
    ${createdAt.slice(8, 10)}일
    `;

    const btnMenu = document.createElement('button');
    btnMenu.classList.add('btn-post-menu');

    const menuText = document.createElement('span');
    menuText.classList.add('sr-only');
    menuText.textContent = '게시글 메뉴 열기';

    listItem.appendChild(authorImage);
    listItem.appendChild(div);
    div.appendChild(authorInfo);
    authorInfo.appendChild(author);
    authorInfo.appendChild(authorId);
    div.appendChild(postText);
    div.appendChild(postImg);
    div.appendChild(utils);
    utils.appendChild(btnLike);
    btnLike.appendChild(likeText);
    utils.appendChild(countLike);
    utils.appendChild(btnComment);
    btnComment.appendChild(commentText);
    utils.appendChild(countComment);
    div.appendChild(date);
    listItem.appendChild(btnMenu);
    btnMenu.appendChild(menuText);
    return listItem;
}

function makePostAlbumItem(post) {
    const { id, image } = post;
    const albumItem = document.createElement('li');
    albumItem.classList.add('post-album-item-wrap');
    const a = document.createElement('a');
    a.setAttribute('href', `./post.html?postId=${id}`);
    a.classList.add('post-album-item');
    a.dataset.postId = id;
    const albumImg = document.createElement('img');
    albumImg.setAttribute('src', trimImageURL(image));
    const images = image.split(',');
    if (images.length > 1) {
        albumImg.setAttribute('src', trimImageURL(images[0]));
    }
    albumImg.setAttribute(
        'onError',
        "this.src='../images/default-post-product-image.png'"
    );
    albumImg.classList.add('post-album-img');
    a.append(albumImg);
    if (images.length > 1) {
        const multiIcon = document.createElement('div');
        multiIcon.classList.add('icon-multi-image');
        a.append(multiIcon);
    }
    albumItem.append(a);
    return albumItem;
}

async function printPost(postData) {
    for (const post of postData) {
        const listItem = makePostListItem(post);
        postList.append(listItem);
        if (!!post.image) {
            const albumItem = makePostAlbumItem(post);
            postAlbum.append(albumItem);
        }
    }
}

// 게시글 무한 스크롤
function postIoCb(entries, postIo) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            postIo.unobserve(entry.target);
            const postData = await getPostData();
            if (postData.length === 0) {
                postIo.disconnect();
            } else {
                printPost(postData);
                observeLastPostListItem(
                    postIo,
                    document.querySelectorAll('.post-list-item')
                );
                observeLastPostAlbumItem(
                    postIo,
                    document.querySelectorAll('.post-album-item-wrap')
                );
            }
        }
    });
}

const postIo = new IntersectionObserver(postIoCb);

function observeLastPostListItem(postIo, items) {
    const lastItem = items[items.length - 2];
    postIo.observe(lastItem);
}

function observeLastPostAlbumItem(postIo, items) {
    const lastItem = items[items.length - 2];
    postIo.observe(lastItem);
}

(async function initPost() {
    const postData = await getPostData();
    if (postData.length === 0) {
        const post = document.querySelector('.post');
        post.remove();
        return;
    }
    printPost(postData);
    if (postData.length >= postLimit) {
        observeLastPostListItem(
            postIo,
            document.querySelectorAll('.post-list-item')
        );
        observeLastPostAlbumItem(
            postIo,
            document.querySelectorAll('.post-album-item-wrap')
        );
    }
})();

// 팔로워, 팔로잉 목록 이동
const followersLink = document.querySelector('.followers-num');
followersLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('is-followers-page', true);
    location.href = `../pages/profileFollow.html?userId=${TARGET_ACCOUNTNAME}`;
});

const followingsLink = document.querySelector('.followings-num');
followingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('is-followers-page', false);
    location.href = `../pages/profileFollow.html?userId=${TARGET_ACCOUNTNAME}`;
});

async function toggleFollow(accountname, endpoint, method) {
    let isSuccess = false;
    try {
        const res = await fetch(
            `${API_URL}/profile/${accountname}/${endpoint}`,
            {
                method: method,
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-type': 'application/json',
                },
            }
        );
        const { profile } = await res.json();

        if (profile) isSuccess = true;
        else alert('오류가 발생했습니다.');
    } catch (error) {
        alert('오류가 발생했습니다.');
    }

    return isSuccess;
}

// 팔로우 버튼 토글
const followBtn = document.querySelector('.btn-follow');
if (followBtn) {
    followBtn.addEventListener('click', async (e) => {
        const target_accountname = e.target.dataset.accountname;
        if (followBtn.classList.contains('following')) {
            const isSuccess = await toggleFollow(
                target_accountname,
                'unfollow',
                'DELETE'
            );
            if (isSuccess) {
                followBtn.classList.remove('following');
                followBtn.textContent = '팔로우';
            }
        } else {
            const isSuccess = await toggleFollow(
                target_accountname,
                'follow',
                'POST'
            );
            if (isSuccess) {
                followBtn.classList.add('following');
                followBtn.textContent = '언팔로우';
            }
        }
    });
}

// 본인 프로필일 때
if (isMyProfile) {
    // 프로필 수정
    const modifyBtn = document.querySelector('.btn-modify');
    modifyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = `../pages/profileModification.html?userId=${TARGET_ACCOUNTNAME}`;
    });

    // 상품 등록
    const addProductBtn = document.querySelector('.btn-add-product');
    addProductBtn.addEventListener('click', () => {
        location.href = '../pages/productAdd.html';
    });
}

// 판매 중인 상품
// 가로 스크롤
productList.addEventListener('wheel', (e) => {
    const { scrollLeft, clientWidth, scrollWidth } = productList;
    // scrollWidth(1500) = clientWidth(370) + scrollLeft(0~1130)
    if (scrollLeft === 0 && e.deltaY < 0) {
        return false;
    }
    if (scrollLeft + clientWidth >= scrollWidth && e.deltaY > 0) {
        return false;
    }
    e.preventDefault();
    productList.scrollBy({
        left: e.deltaY < 0 ? -100 : 100,
    });
});

productList.addEventListener('click', (e) => {
    if (
        (e.target.parentNode.classList.contains('product-item') ||
            e.target.classList.contains('product-item')) &&
        isMyProfile
    ) {
        e.preventDefault();
        // 모달 띄우기
    }
});

// 게시물 표기 방식 전환
const listBtn = document.querySelector('.btn-list');
const albumBtn = document.querySelector('.btn-album');

listBtn.addEventListener('click', () => {
    listBtn.classList.add('selected');
    albumBtn.classList.remove('selected');
    postList.classList.remove('hidden');
    postAlbum.classList.add('hidden');
});

albumBtn.addEventListener('click', () => {
    listBtn.classList.remove('selected');
    albumBtn.classList.add('selected');
    postList.classList.add('hidden');
    postAlbum.classList.remove('hidden');
});

// 목록형 게시글의 각종 기능들 분기
postList.addEventListener('click', (e) => {
    if (
        e.target.classList.contains('post-text') ||
        e.target.classList.contains('post-img') ||
        e.target.classList.contains('btn-comment')
    ) {
        postDetail(e.target);
        return;
    }
    if (e.target.classList.contains('btn-like')) {
        handleClickLikeBtn(e.target);
        return;
    }
});

// 앨범형 게시글 상세 페이지 이동
postAlbum.addEventListener('click', (e) => {
    if (e.target.parentNode.classList.contains('post-album-item')) {
        postDetail(e.target.parentNode);
    }
});

// 게시글 좋아요
async function handleClickLikeBtn(likeBtn) {
    const isHearted = likeBtn.dataset.hearted;
    const likeCount = likeBtn.nextSibling;
    const targetPostId = likeBtn.closest('.post-list-item').dataset.postId;

    if (isHearted === 'false') {
        const isSuccess = await toggleHeart(targetPostId, 'heart');
        if (isSuccess) {
            likeBtn.dataset.hearted = true;
            likeCount.textContent = +likeCount.textContent + 1;
        }
    } else {
        const isSuccess = await toggleHeart(targetPostId, 'unheart');
        if (isSuccess) {
            likeBtn.dataset.hearted = false;
            likeCount.textContent -= 1;
        }
    }
}

async function toggleHeart(postId, mode) {
    const method = {
        heart: 'POST',
        unheart: 'DELETE',
    };
    let isSuccess = false;

    try {
        const res = await fetch(`${API_URL}/post/${postId}/${mode}`, {
            method: method[mode],
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const { post } = await res.json();

        if (post) {
            isSuccess = true;
        } else {
            alert('오류가 발생했습니다.');
        }
    } catch (error) {
        alert('오류가 발생했습니다.', error.message);
    }

    return isSuccess;
}

// 게시글 상세 페이지 이동
function postDetail(post) {
    const postId = post.dataset.postId;
    location.href = `../pages/post.html?postId=${postId}`;
}
