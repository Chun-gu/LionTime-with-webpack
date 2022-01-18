const TOKEN = sessionStorage.getItem('Token');
const MY_ID = sessionStorage.getItem('_id');
let putData;
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
    const POST_ID = sessionStorage.getItem('post-id'); // 로컬의 게시글 아이디값
    const res = await fetch(`http://146.56.183.55:5050/post/${POST_ID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const data = await res.json();

    let imgData = data.post.image.split(',');
    for (const imgName of imgData) {
        postList.innerHTML += `<li><img src="${imgName}" alt="게시글 이미지"></li>`;
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
    } = data.post;
    nameUser.textContent = author.username;
    idUser.textContent = author.accountname;
    txtDesc.textContent = content;
    countLike.textContent = heartCount;
    countComment.textContent = commentCount;
    const createDate = createdAt.split('T')[0].split('-');
    postDate.textContent = `${createDate[0]}년 ${createDate[1]}월 ${createDate[2]}일`;
    postUserProfile.src = author.image;

    postUserProfile.addEventListener('click', () => {
        targetAccountName(author.accountname);
    });

    putData = {
        id: id,
        desc: content,
        image: image,
    };
    heartCheck = hearted;

    if (heartCheck === true) {
        btnLike.src = '../images/icon-heart-fill.png';
    }

    if (MY_ID !== author._id) {
        postBtn.classList.add('user');
    }

    getComment();
    timeNow();
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
                sessionStorage.setItem('putItem', JSON.stringify(putData));
                location.href = '/pages/postUpload.html';
            });
        }
    }, 20);
});

// 3-2. 게시글 삭제
async function postDel() {
    const res = await fetch(`http://146.56.183.55:5050/post/${putData.id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
    const data = await res.json();
    console.log(data);

    if (data) {
        alert('삭제 성공');
        location.href = '/pages/profile.html';
    } else {
        alert('삭제 실패');
    }
}

// 3-3. 게시글 신고
async function postReport() {
    const res = await fetch(
        `http://146.56.183.55:5050/post/${putData.id}/report`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    const data = await res.json();
    console.log(data);

    if (data) {
        alert('신고가 접수되었습니다.');
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
            console.log(alertOn.children[1].children[1].className);
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
    await fetch(`http://146.56.183.55:5050/post/${putData.id}/heart`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
    });
}
// 좋아요 취소
async function unHeart() {
    await fetch(`http://146.56.183.55:5050/post/${putData.id}/unheart`, {
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
inpComment.addEventListener('input', () => {
    console.log(inpComment.value);
    if (inpComment.value) {
        btnComment.disabled = false;
    } else {
        btnComment.disabled = true;
    }
});

btnComment.addEventListener('click', (e) => {
    postComment();
});

// 7-2. 댓글 작성
async function postComment() {
    console.log(inpComment.value);

    await fetch(`http://146.56.183.55:5050/post/${putData.id}/comments`, {
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
    inpComment.value = '';
    location.reload();
}

// 7-3. 댓글 리스트
let commentsId = [];
let delId;
async function getComment() {
    const res = await fetch(
        `http://146.56.183.55:5050/post/${putData.id}/comments`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    const data = await res.json();

    let liComment = document.querySelector('.cont-comments ul');
    for (const [index, comment] of data.comments.entries()) {
        commentsId.push(comment.id);
        liComment.innerHTML += `
      <li>
        <button></button>    
        <a href="profile.html"><img src=${
            comment.author.image
        } alt="작성자 프로필 사진" class="img-user-comment"></a>
        <div class="box-comment">
            <p class="txt-comment-name-user">${
                comment.author.username
            }<small>· ${dateBefore(comment.createdAt)}</small></p>
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
                [index].classList.add('user');
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
            console.log(delId);
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

// 7-4. 댓글 삭제
async function commentDel() {
    const res = await fetch(
        `http://146.56.183.55:5050/post/${putData.id}/comments/${delId}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    const data = await res.json();
    console.log(data);

    if (data) {
        alert('삭제 성공');
        location.reload();
    } else {
        alert('삭제 실패');
    }
}

// 7-5. 댓글 신고
async function commentReport() {
    const res = await fetch(
        `http://146.56.183.55:5050/post/${putData.id}/comments/${delId}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    const data = await res.json();
    console.log(data);

    if (data) {
        alert('신고가 접수되었습니다.');
        location.reload();
    } else {
        alert('신고 실패');
    }
}

// 8. 날짜 차이 구하기
function dateBefore(createdAt) {
    const now = new Date();
    let nowISO = now.toISOString();
    if (nowISO.slice(0, 4) > createdAt.slice(0, 4)) {
        return `${nowISO.slice(0, 4) - createdAt.slice(0, 4)}년 전`;
    } else if (nowISO.slice(5, 7) > createdAt.slice(5, 7)) {
        return `${nowISO.slice(5, 7) - createdAt.slice(5, 7)}월 전`;
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

// 9. status bar 시간
const timeStatus = document.querySelector('.text-current-time');
function timeNow() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    if (hour > 12) {
        timeStatus.textContent = `${hour - 12}:${min} PM`;
    } else {
        timeStatus.textContent = `${hour}:${min} AM`;
    }
}

// 10. my profile image
async function myProfile() {
    const accountName = sessionStorage.getItem('accountname');
    const res = await fetch(
        `http://146.56.183.55:5050/profile/${accountName}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    const data = await res.json();
    commentUser.src = data.profile.image;
}

// 11. store Target User AccountName
function targetAccountName(id) {
    sessionStorage.setItem('target-account', id);
}
