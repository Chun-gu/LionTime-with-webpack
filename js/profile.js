const API_URL = 'http://146.56.183.55:5050/';
const MY_ID = sessionStorage.getItem('my-id');
const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const TOKEN = sessionStorage.getItem('my-token');
const TARGET_ACCOUNTNAME = location.href.split('?')[1];
const isMyProfile = MY_ACCOUNTNAME === TARGET_ACCOUNTNAME;

// 로그인
(async function login() {
    try {
        const res = await fetch(API_URL + 'user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    email: 'testEmail@test.com',
                    password: 'testpassword',
                },
            }),
        });
        const resJson = await res.json();
        const { _id, accountname, token } = resJson.user;
        sessionStorage.setItem('my-id', _id);
        sessionStorage.setItem('my-token', token);
        sessionStorage.setItem('my-accountname', accountname);
    } catch (err) {
        console.log(err);
    }
})();

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
        const resJson = await res.json();
        return resJson;
    } catch (err) {}
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
    const endpoint = `profile/${TARGET_ACCOUNTNAME}`;
    const data = await fetchData(endpoint);
    const profileData = data.profile;
    const {
        username,
        accountname,
        intro,
        image,
        follower,
        followerCount,
        followingCount,
    } = profileData;

    const profileImg = document.querySelector('.profile-img');
    const followersNum = document.querySelector('.followers-num');
    const followingNum = document.querySelector('.followings-num');
    const userName = document.querySelector('.user-name');
    const userId = document.querySelector('.user-id');
    const userIntro = document.querySelector('.user-intro');
    const followBtn = document.querySelector('.btn-follow');

    if (image.match(/^http\:\/\/146\.56\.183\.55\:5050\//, 'i')) {
        profileImg.setAttribute('src', image);
    } else {
        profileImg.setAttribute('src', API_URL + image);
    }
    console.log(image);
    followersNum.textContent = `${followerCount}`;
    followingNum.textContent = `${followingCount}`;
    userName.textContent = username;
    userId.textContent = `@ ${accountname}`;
    userIntro.textContent = intro;
    if (followBtn) {
        if (follower.includes(MY_ACCOUNTNAME)) {
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
    const endpoint = `product/${TARGET_ACCOUNTNAME}/?limit=${productLimit}&skip=${productSkip}`;
    const data = await fetchData(endpoint);
    const productData = data.product;
    productSkip += productLimit;
    return productData;
}

function makeProductItem(product) {
    const { id, itemImage, itemName, link, price } = product;
    const li = document.createElement('li');
    li.classList.add('product-item-wrap');
    const a = document.createElement('a');
    a.classList.add('product-item');
    a.setAttribute('href', link);
    a.dataset.productId = id;
    const img = document.createElement('img');
    img.setAttribute('src', itemImage);
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
    a.append(img);
    a.append(p);
    a.append(span);
    li.append(a);
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
                    document.querySelectorAll('.product-item-wrap')
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
    observeLastItem(productIo, document.querySelectorAll('.product-item-wrap'));
})();

// 게시글 출력
const postList = document.querySelector('.post-list');
const postAlbum = document.querySelector('.post-album');
const postLimit = 9;
let postSkip = 0;

async function getPostData() {
    const endpoint = `post/${TARGET_ACCOUNTNAME}/userpost/?limit=${postLimit}&skip=${postSkip}`;
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
    const authorImage = document.createElement('img');
    authorImage.classList.add('post-author-img');
    if (authorImg.match(/^http\:\/\/146\.56\.183\.55\:5050\//, 'i')) {
        authorImage.setAttribute('src', authorImg);
    } else {
        authorImage.setAttribute('src', API_URL + authorImg);
    }
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
    if (image.split(',').length > 1) {
        postImg.setAttribute('src', image.split(',')[0]);
    } else {
        postImg.setAttribute('src', image);
    }
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
    a.setAttribute('href', './post.html');
    a.classList.add('post-album-item');
    a.dataset.postId = id;
    const albumImg = document.createElement('img');
    albumImg.setAttribute('src', `${image}`);
    if (image.split(',').length > 1) {
        albumImg.setAttribute('src', `${image.split(',')[0]}`);
    }
    albumImg.setAttribute(
        'onError',
        "this.src='../images/default-post-product-image.png'"
    );
    albumImg.classList.add('post-album-img');
    a.append(albumImg);
    if (image.split(',').length > 1) {
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
    observeLastPostListItem(
        postIo,
        document.querySelectorAll('.post-list-item')
    );
    observeLastPostAlbumItem(
        postIo,
        document.querySelectorAll('.post-album-item-wrap')
    );
})();

// 팔로워, 팔로잉 목록 이동
const followersLink = document.querySelector('.followers-num');
followersLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('is-followers-page', true);
    location.href = `../pages/profileFollow.html?${TARGET_ACCOUNTNAME}`;
});

const followingsLink = document.querySelector('.followings-num');
followingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('is-followers-page', false);
    location.href = `../pages/profileFollow.html?${TARGET_ACCOUNTNAME}`;
});

// 채팅하기
if (!isMyProfile) {
    const chatBtn = document.querySelector('.btn-chat');
    chatBtn.addEventListener('click', () => {
        localStorage.setItem('target-id', TARGET_ID);
    });
}

// 팔로우 버튼 토글
const followBtn = document.querySelector('.btn-follow');
if (followBtn) {
    followBtn.addEventListener('click', () => {
        if (followBtn.classList.contains('following')) {
            followBtn.classList.remove('following');
            followBtn.textContent = '팔로우';
        } else {
            followBtn.classList.add('following');
            followBtn.textContent = '언팔로우';
        }
    });
}

// 본인 프로필일 때
if (isMyProfile) {
    // 프로필 수정
    const modifyBtn = document.querySelector('.btn-modify');
    modifyBtn.addEventListener('click', (e) => {
        e.preventDefault();
        location.href = `../pages/profileModification.html?${TARGET_ACCOUNTNAME}`;
    });

    // 상품 등록
    const addProductBtn = document.querySelector('.btn-add-product');
    addProductBtn.addEventListener('click', () => {
        location.href = '../pages/productAdd.html';
    });
}

// 판매 중인 상품
// const productList = document.querySelector('.product-list');
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
// const postList = document.querySelector('.post-list');
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
        likePost(e.target);
        return;
    }
    if (e.target.classList.contains('btn-post-menu')) {
        // 모달 띄우기
        // const modal = document.querySelector(".modal");
        // modal.style.backgroundColor="red";
    }
});

// 앨범형 게시글 상세 페이지 이동
// const postAlbum = document.querySelector('.post-album');
postAlbum.addEventListener('click', (e) => {
    if (e.target.parentNode.classList.contains('post-album-item')) {
        postDetail(e.target.parentNode);
    }
});

// 게시글 좋아요
function likePost(likeBtn) {
    const isHearted = likeBtn.dataset.hearted;
    const likeCount = likeBtn.nextSibling;
    if (isHearted === 'true') {
        likeBtn.dataset.hearted = false;
        likeCount.textContent -= 1;
    } else {
        likeBtn.dataset.hearted = true;
        likeCount.textContent = +likeCount.textContent + 1;
    }
}

// 게시글 상세 페이지 이동
function postDetail(post) {
    const postId = post.dataset.postId;
    location.href = `../pages/post.html?${postId}`;
}
