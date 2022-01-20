const TOKEN = sessionStorage.getItem('my-token');

console.log(TOKEN);

async function getFeed() {
    const url = 'http://146.56.183.55:5050';

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
    console.log(json);
    return json;
}

async function printFeed() {
    const feedData = await getFeed();
    if (feedData.posts.length > 0) {
        const noFeed = document.querySelector('.noFeed');
        noFeed.remove();
    }
    console.log(typeof feedData.posts);
    const postContainer = document.querySelector('.post');
    for (const feed of feedData.posts) {
        console.log(feed);
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
            <a href="#" class="">
                <img src=${authorImage} alt="user profile image" class="usrImg" />
            </a>
            <div class="postOne">
                <h3>
                    <a href="../pages/profile.html?${accountname}" class="usrName">${username}</a>
                </h3>
                <a class="usrSubName">@ ${accountname}</a>
                <p class="postTxt" data-post-id=${id}>
                    ${content}
                </p>
                <img src=${image} alt="" onerror="this.src='../images/default-post-product-image.png'" class="postImg" data-post-id=${id}/>
                <div class="reaction">
                    <button type="button" class="like" data-hearted=${hearted}></button>
                    <span class="count heart-count">${heartCount}</span>
                    <a href= "../pages/post.html?${id}">
                        <button class="commentBtn" type="button" data-post-id=${id}>
                            <img src="../images/icon-message-small.png" alt="" class="commentIcon" />
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
console.log('goPostPage: ', goPostPage);

getFeed();

printFeed();
const postContainer = document.querySelector('.post');
postContainer.addEventListener('click', (e) => {
    console.log(e.target);
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

// postContainer.addEventListener('click', (e) => {
//     console.log(e.target);
//     if (e.target.classList.contains('commentIcon')) {
//         location.href = `../pages/post.html?${id}`;
//     }
// });
