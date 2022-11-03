import { API_URL } from './key.js';
import { getFromQueryString, trimImageURL } from './lib.js';

const TOKEN = sessionStorage.getItem('my-token');
const MY_ID = sessionStorage.getItem('my-id');
const accountName = sessionStorage.getItem('my-accountname');
const POST_ID = getFromQueryString('postId');

let heartCheck;

// 1. 뒤로가기 버튼
const btnBack = document.querySelector('.btn-back');
btnBack.addEventListener('click', () => {
    history.back();
});

// 2. GET /post/:post_id 값 가져오기
const nameUser = document.querySelector('.name-user');
const idUser = document.querySelector('.id-user');
const txtDesc = document.querySelector('.txt-desc');
const postList = document.querySelector('.post-list');
const countLike = document.querySelector('.count-like');
const countComment = document.querySelector('.count-comment');
const imgCheck = document.querySelector('.img-check');
const postUserProfile = document.querySelector('.img-user-profile');
const postDate = document.querySelector('.date-upload');
const commentUser = document.querySelector('.img-profile');

(async function getPostData() {
    const res = await fetch(`${API_URL}/post/${POST_ID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const { post } = await res.json();

    let imageNames = post.image.split(',');
    for (const imageName of imageNames) {
        postList.innerHTML += `<li><img src="${trimImageURL(
            imageName
        )}" alt="게시글 이미지" onerror="this.src='../images/default-post-product-image.png'"></li>`;
        imgCheck.innerHTML += `<li></li>`;
    }
    imgCheck.firstChild.style.backgroundColor = '#F26E22';

    const {
        id,
        image,
        author,
        content,
        hearted,
        heartCount,
        commentCount,
        createdAt,
    } = post;

    document.querySelector(
        '.img-user a'
    ).href = `../pages/profile.html?userId=${author.accountname}`;
    nameUser.textContent = author.username;
    idUser.textContent = author.accountname;
    txtDesc.textContent = content;
    countLike.textContent = heartCount;
    countComment.textContent = commentCount;
    const createDate = createdAt.split('T')[0].split('-');
    postDate.textContent = `${createDate[0]}년 ${createDate[1]}월 ${createDate[2]}일`;
    postUserProfile.src = trimImageURL(author.image);
    postUserProfile.addEventListener('click', () => {
        targetAccountName(author.accountname);
    });

    heartCheck = hearted;

    if (heartCheck === true) {
        btnLike.src = '../images/icon-heart-fill.png';
    }

    if (MY_ID !== author._id) {
        postBtn.classList.add('user');
    }

    getComment();
    myProfile();
})();

// 3. 게시글 수정, 삭제
let btnCheck;
const postBtn = document.querySelector('.box-post .btn-more-mini');

// 3-1. 게시글 수정
postBtn.addEventListener('click', () => {
    btnCheck = 'post';
    setTimeout(function () {
        const btnUpdate = document.querySelector('.update');
        if (btnUpdate) {
            btnUpdate.addEventListener('click', () => {
                location.href = `../pages/postUpload.html?postId=${POST_ID}`;
            });
        }
    }, 20);
});

// 3-2. 게시글 삭제
async function postDel() {
    const res = await fetch(`${API_URL}/post/${POST_ID}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const data = await res.json();

    if (data) {
        location.href = `/pages/profile.html?userId=${accountName}`;
    } else {
        alert('삭제 실패');
    }
}

// 3-3. 게시글 신고
async function postReport() {
    const res = await fetch(`${API_URL}/post/${POST_ID}/report`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const data = await res.json();

    if (data) {
        location.reload();
    } else {
        alert('신고 실패');
    }
}

// 4. 이미지 슬라이드
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

let index = 0;

prevButton.addEventListener('click', (e) => {
    if (index === 0) return;
    imgCheck.childNodes[index].style.backgroundColor = '#fff';
    index -= 1;
    postList.style.transform = `translate3d(-${304 * index}px, 0, 0)`;
    imgCheck.childNodes[index].style.backgroundColor = '#F26E22';
});
nextButton.addEventListener('click', () => {
    if (index === postList.childElementCount - 1) return;
    imgCheck.childNodes[index].style.backgroundColor = '#fff';
    index += 1;
    postList.style.transform = `translate3d(-${304 * index}px, 0, 0)`;
    imgCheck.childNodes[index].style.backgroundColor = '#F26E22';
});

// 5. 이미지 슬라이드, 삭제 alert 겹침현상 제거
document.addEventListener('click', (e) => {
    setTimeout(function () {
        const alertOn = document.querySelector('.alert.on');
        if (alertOn) {
            document.querySelector('.btn-slide').style.zIndex = 0;
            // 게시글 삭제
            if (
                alertOn.children[1].children[1].className ==
                'btn-alert btn-delete'
            ) {
                alertOn.children[1].children[1].addEventListener(
                    'click',
                    () => {
                        if (btnCheck === 'post') {
                            postDel();
                        } else if (btnCheck === 'comment') {
                            commentDel();
                        }
                    }
                );
            } // 게시글 신고
            else if (
                alertOn.children[1].children[1].className ==
                'btn-alert btn-report'
            ) {
                alertOn.children[1].children[1].addEventListener(
                    'click',
                    () => {
                        if (btnCheck === 'post') {
                            postReport();
                        } else if (btnCheck === 'comment') {
                            commentReport();
                        }
                    }
                );
            }
        } else {
            document.querySelector('.btn-slide').style.zIndex = 10;
        }
    }, 200);
});

// 6. 좋아요/좋아요 취소
const btnLike = document.querySelector('.img-like');

btnLike.addEventListener('click', () => {
    if (heartCheck === true) {
        btnLike.src = '../images/icon-heart.png';
        heartCheck = false;
        countLike.textContent = parseInt(countLike.textContent) - 1;
        unHeart();
    } else {
        btnLike.src = '../images/icon-heart-fill.png';
        heartCheck = true;
        countLike.textContent = parseInt(countLike.textContent) + 1;
        heart();
    }
});

// 좋아요
async function heart() {
    await fetch(`${API_URL}/post/${POST_ID}/heart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
}
// 좋아요 취소
async function unHeart() {
    await fetch(`${API_URL}/post/${POST_ID}/unheart`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
}

// 7. 댓글 기능
const btnComment = document.querySelector('.btn-comment');
const inpComment = document.querySelector('#txt-comment');

// 7-1. 게시 버튼 활성화
if (inpComment.value) {
    btnComment.disabled = false;
} else {
    btnComment.disabled = true;
}
inpComment.addEventListener('input', () => {
    if (inpComment.value) {
        btnComment.disabled = false;
    } else {
        btnComment.disabled = true;
    }
});

// 7-3. 댓글 리스트
let commentsId = [];
let delId;
async function getComment() {
    const res = await fetch(`${API_URL}/post/${POST_ID}/comments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const data = await res.json();

    let liComment = document.querySelector('.cont-comments ul');
    for (const [index, comment] of data.comments.entries()) {
        commentsId.push(comment.id);

        liComment.innerHTML += `
        <li class="comment-card" data-comment-id="${comment.id}">
            <button></button>    
            <a href="profile.html?userId=${comment.author.accountname}">
                <img src=${trimImageURL(
                    comment.author.image
                )} alt="작성자 프로필 사진" class="img-user-comment" onerror="this.src='../images/default-profile-img-small.png'">
            </a>
            <div class="box-comment">
                <p class="txt-comment-name-user">${comment.author.username}
                    <small>· ${dateBefore(comment.createdAt)}</small>
                </p>
                <p class="txt-comment-desc">${comment.content}</p>
            </div>
        </li>
        `;

        if (comment.author._id === MY_ID) {
            document
                .querySelectorAll('.li-comments li button')
                [index].classList.add('btn-more-mini');
        } else {
            document
                .querySelectorAll('.li-comments li button')
                [index].classList.add('btn-more-mini');
            document
                .querySelectorAll('.li-comments li button')
                [index].classList.add('comment');
        }
    }

    const linkProfile = document.querySelectorAll('.img-user-comment');
    for (const [index, profile] of linkProfile.entries()) {
        profile.addEventListener('click', () => {
            targetAccountName(data.comments[index].author.accountname);
        });
    }

    const btnsMore = document.querySelectorAll('.li-comments li button');
    for (const [index, button] of btnsMore.entries()) {
        button.addEventListener('click', () => {
            btnCheck = 'comment';
            delId = commentsId[index];
            setTimeout(function () {
                const putBtn = document.querySelectorAll(
                    '.list-modal-container li'
                )[1];
                if (putBtn) {
                    putBtn.classList.add('sr-only');
                }
            }, 20);
        });
    }
}

// 7-2. 댓글 작성
const commentForm = document.querySelector('#comment-form');
commentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    postComment();
});

async function postComment() {
    try {
        const res = await fetch(`${API_URL}/post/${POST_ID}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                comment: {
                    content: inpComment.value,
                },
            }),
        });
        const { comment } = await res.json();

        if (comment) {
            inpComment.value = '';
            location.reload();
        } else {
            alert('댓글 작성을 실패했습니다.');
        }
    } catch (error) {
        alert('댓글 작성을 실패했습니다.');
    }
}

// 7-4. 댓글 삭제
async function commentDel() {
    try {
        const res = await fetch(
            `${API_URL}/post/${POST_ID}/comments/${delId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );
        const data = await res.json();

        if (data.status === '200') {
            alert(data.message);
            location.reload();
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('댓글 삭제를 실패했습니다.');
    }
}

// 8. 날짜 차이 구하기
function dateBefore(createdAt) {
    const now = new Date();
    let nowISO = now.toISOString();
    if (nowISO.slice(0, 4) > createdAt.slice(0, 4)) {
        return `${nowISO.slice(0, 4) - createdAt.slice(0, 4)}년 전`;
    } else if (nowISO.slice(5, 7) > createdAt.slice(5, 7)) {
        return `${nowISO.slice(5, 7) - createdAt.slice(5, 7)}개월 전`;
    } else if (nowISO.slice(8, 10) > createdAt.slice(8, 10)) {
        return `${nowISO.slice(8, 10) - createdAt.slice(8, 10)}일 전`;
    } else if (nowISO.slice(11, 13) > createdAt.slice(11, 13)) {
        return `${nowISO.slice(11, 13) - createdAt.slice(11, 13)}시간 전`;
    } else if (nowISO.slice(14, 16) > createdAt.slice(14, 16)) {
        return `${nowISO.slice(14, 16) - createdAt.slice(14, 16)}분 전`;
    } else {
        return '방금';
    }
}

// 10. my profile image
async function myProfile() {
    const res = await fetch(`${API_URL}/profile/${accountName}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const data = await res.json();
    commentUser.src = trimImageURL(data.profile.image);
}

// 11. store Target User AccountName
function targetAccountName(id) {
    location.href = `../pages/profile.html?userId=${id}`;
}
