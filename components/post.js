import { trimImageURL } from '../js/lib.js';

export function makePostListItem(data) {
    const {
        id,
        author: { image: authorImage, username, accountname },
        content,
        image,
        heartCount,
        hearted,
        commentCount,
        createdAt,
    } = data;

    return `
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
