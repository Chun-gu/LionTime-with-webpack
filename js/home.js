import { API_URL } from './key.js';
import { makePostListItem } from '../components/post.js';

const TOKEN = sessionStorage.getItem('my-token');
const LIMIT = 4;
let skip = 0;

const feedList = document.querySelector('.feed-list');

function printFeed(feeds) {
    for (const feed of feeds) {
        const postItem = makePostListItem(feed);
        feedList.innerHTML += postItem;
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
        skip += 4;

        return data;
    } catch (error) {
        alert('피드를 가져오는 데에 실패했습니다.');
    }
}

function feedIOCallback(entries, feedIO) {
    entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
            feedIO.unobserve(entry.target);
            const { posts } = await getFeed();
            if (posts && posts.length === 0) {
                feedIO.disconnect();
            } else {
                printFeed(posts);
                observeLastPost(
                    feedIO,
                    document.querySelectorAll('.post-card')
                );
            }
        }
    });
}

const feedIO = new IntersectionObserver(feedIOCallback);

function observeLastPost(feedIO, items) {
    const lastItem = items[items.length - 1];
    feedIO.observe(lastItem);
}

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

(async function initFeed() {
    if (!TOKEN) {
        alert('로그인이 필요한 서비스입니다.');
        history.replaceState(null, null, '../pages/login.html');
        location.reload();
    } else {
        const { posts } = await getFeed();

        if (posts.length === 0) {
            printNoFeed();
            return;
        }

        printFeed(posts);
        if (posts.length >= LIMIT) {
            observeLastPost(feedIO, document.querySelectorAll('.post-card'));
        }
    }
})();
