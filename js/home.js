import { API_URL, IMAGE_URL } from './key.js';
import { trimImageURL } from './lib.js';
const TOKEN = sessionStorage.getItem('my-token');

const LIMIT = 5;
let skip = 0;

printFeed();

async function printFeed() {
    const { posts } = await getFeed();

    if (posts.length === 0) {
        printNoFeed();
        return;
    }

    for (const post of posts) {
        const {
            id,
            author: { image: authorImage, username, accountname },
            content,
            image,
            heartCount,
            hearted,
            commentCount,
            createdAt,
        } = post;
        feedList.innerHTML += `
        <li class="post-card">
            <a class="author-image" href="../pages/profile.html?userId=${accountname}">
                <img src=${trimImageURL(
                    authorImage
                )} alt="${accountname}" onerror="this.src='../images/default-profile-img.png'"/>
            </a>
            <div class="post-content">
                <a class="author-profile">
                    <span class="user-name">${username}</span>
                    <span class="account-name">@ ${accountname}</span>
                </a>
                <p class="post-text">
                    ${content}
                </p>
                <a href="../pages/post.html?postId=${id}">
                    <img src=${trimImageURL(
                        image
                    )} alt="post image" onerror="this.src='../images/default-post-product-image.png'" class="post-image" />
                </a>
                <div class="reaction">
                    <button type="button" class="like" data-hearted=${hearted}></button>
                    <span class="count heart-count">${heartCount}</span>
                    <a href= "../pages/post.html?postId=${id}">
                        <button class="comment-btn" type="button" data-post-id=${id}>
                            <img src="../images/icon-message-small.png" class="comment-icon" />
                        </button>
                        <span class="count comment-count">${commentCount}</span>
                    </a>
                </div>
                <small class="post-date">
                    ${createdAt.slice(0, 4)}년 
                    ${createdAt.slice(5, 7)}월 
                    ${createdAt.slice(8, 10)}일 
                </small>
            </div>
        </li>
        `;
    }
}

async function getFeed() {
    try {
        const res = await fetch(
            `${API_URL}/post/feed?limit=${LIMIT}&skip=${skip}`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-type': 'application/json',
                },
            }
        );
        const data = await res.json();

        return data;
    } catch (error) {
        console.log(error);
        alert('피드를 가져오는 데에 실패했습니다.');
    }
}

const feedList = document.querySelector('.feed-list');
function printNoFeed() {
    const li = document.createElement('li');
    li.classList.add('no-feed');

    const img = document.createElement('img');
    img.classList.add('logo');
    img.src = '../images/logo-lion-grey.png';
    img.setAttribute('alt', '라이언 타임 로고');

    const span = document.createElement('span');
    span.classList.add('follow-suggestion');
    span.textContent = '유저를 검색해 팔로우 해보세요!';

    const a = document.createElement('a');
    a.classList.add('searchBtn');
    a.href = '../pages/search.html';
    a.textContent = '검색하기';

    li.append(img);
    li.append(span);
    li.append(a);
    feedList.append(li);
}

// const goPostPage = document.querySelectorAll('.commentBtn');
// for (const [idx, comment] of goPostPage.entries()) {
//     comment.addEventListener('click', () => {
//         window.location.href = `post.html?postId=${posts[idx].id}`;
//     });
// }

// const postContainer = document.querySelector('.post');
// postContainer.addEventListener('click', (e) => {
//     if (e.target.classList.contains('like')) {
//         likePost(e.target);
//         return;
//     }
// });

// function likePost(target) {
//     const isHearted = target.dataset.hearted;
//     const likeCount = target.nextSibling.nextSibling;
//     if (isHearted === 'true') {
//         target.dataset.hearted = false;
//         likeCount.textContent -= 1;
//     } else {
//         target.dataset.hearted = true;
//         likeCount.textContent = +likeCount.textContent + 1;
//     }
// }
