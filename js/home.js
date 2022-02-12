const TOKEN = sessionStorage.getItem('my-token');

async function getFeed() {
    const url = 'https://api.mandarin.cf';

    const res = await fetch(url + '/post/feed', {
        //메소드 구분
        method: 'GET',
        //헤더
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-type': 'application/json',
        },
    });
    const json = await res.json(); //외않됌? 포인트 res.json()도 비동기. await을 해줘야한다.
    return json;
}

async function printFeed() {
    const feedData = await getFeed();
    if (feedData.posts.length > 0) {
        const noFeed = document.querySelector('.noFeed');
        noFeed.remove();
    }
    const postContainer = document.querySelector('.post');
    for (const feed of feedData.posts) {
        const {
            id,
            author: { image: authorImage, username, accountname },
            content,
            image,
            heartCount,
            hearted,
            commentCount,
            createdAt,
        } = feed;
        postContainer.innerHTML += `
        <article class="postCont">
            <a href="#">
                <img src=${authorImage} alt="user profile image" onerror="this.src='../images/default-profile-img.png'" class="usrImg" />
            </a>
            <div class="postOne">
                <h3>
                    <a href="../pages/profile.html?${accountname}" class="usrName">${username}</a>
                </h3>
                <a class="usrSubName">@ ${accountname}</a>
                <p class="postTxt" data-post-id=${id}>
                    ${content}
                </p>
                <img src=${image} alt="post image" onerror="this.src='../images/default-post-product-image.png'" class="postImg" data-post-id=${id}/>
                <div class="reaction">
                    <button type="button" class="like" data-hearted=${hearted}></button>
                    <span class="count heart-count">${heartCount}</span>
                    <a href= "../pages/post.html?${id}">
                        <button class="commentBtn" type="button" data-post-id=${id}>
                            <img src="../images/icon-message-small.png" class="commentIcon" />
                        </button>
                        <span class="count comment-count">${commentCount}</span>
                    </a>
                </div>
                <small class="postDate">
                    ${createdAt.slice(0, 4)}년 
                    ${createdAt.slice(5, 7)}월 
                    ${createdAt.slice(8, 10)}일 
                </small>
            </div> 
        </article>
        `;
    }
}

const goPostPage = document.querySelectorAll('.commentBtn');
for (const [idx, comment] of goPostPage.entries()) {
    comment.addEventListener('click', () => {
        window.location.href = `post.html?${posts[idx].id}`;
    });
}

getFeed();

printFeed();
const postContainer = document.querySelector('.post');
postContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('like')) {
        likePost(e.target);
        return;
    }
});
function likePost(target) {
    const isHearted = target.dataset.hearted;
    const likeCount = target.nextSibling.nextSibling;
    if (isHearted === 'true') {
        target.dataset.hearted = false;
        likeCount.textContent -= 1;
    } else {
        target.dataset.hearted = true;
        likeCount.textContent = +likeCount.textContent + 1;
    }
}
