import { API_URL } from './key.js';
import { getFromQueryString } from './lib.js';

const closeBtn = document.querySelector('.btn-closed');
const alertModal = document.querySelector('.alert');
const alertDimd = document.querySelector('.alert-dimd');
const TOKEN = sessionStorage.getItem('my-token');

closeBtn.addEventListener('click', () => {
    alertModal.classList.remove('on');
    alertDimd.classList.remove('on');
});

document.addEventListener('click', (e) => {
    const classList = e.target.classList.value;
    if (classList === 'btn-list logOut') {
        createAlert('로그아웃하시겠어요?', '로그아웃', 'btn-logout');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (classList === 'btn-list delete') {
        createAlert('게시글을 삭제할까요?', '삭제', 'btn-delete');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (classList === 'btn-list post-report') {
        createAlert('이 게시글을 신고하시겠어요?', '신고', 'btn-report-post');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (classList === 'btn-list comment-report') {
        createAlert('이 댓글을 신고하시겠어요?', '신고', 'btn-report-comment');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (classList === 'btn-list productDelete') {
        createAlert('상품을 삭제할까요?', '삭제', 'btn-product-delete');
        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (classList === 'btn-list productUpdate') {
        updateProduct();
    } else if (classList === 'btn-list update') {
        updatePost();
    }
});

alertModal.addEventListener('click', (e) => {
    const classList = e.target.classList.value;
    if (classList === 'btn-alert btn-logout') {
        sessionStorage.removeItem('my-id');
        sessionStorage.removeItem('my-token');
        sessionStorage.removeItem('my-accountname');

        location.href = 'login.html';
    } else if (classList === 'btn-alert btn-delete') {
        deletePost();
    } else if (classList === 'btn-alert btn-product-delete') {
        const productId = sessionStorage.getItem('targetProductId');
        deleteProduct(productId);
    } else if (classList === 'btn-alert btn-report-post') {
        reportPost();
    } else if (classList === 'btn-alert btn-report-comment') {
        reportComment();
    }
});

function createAlert(infoText, btnText, addClass) {
    document.querySelector('.txt-alert-message').innerText = infoText;
    document.querySelector('.btn-alert:last-child').innerText = btnText;
    document.querySelector('.btn-alert:last-child').classList.add(addClass);
}

function updateProduct() {
    const productId = sessionStorage.getItem('targetProductId');

    location.href = `../pages/productAdd.html?productId=${productId}`;
}

async function deleteProduct(productId) {
    const res = await fetch(API_URL + `/product/${productId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-type': 'application/json',
        },
    });
    const data = await res.json();

    if (data) {
        location.href = `profile.html?userId=${sessionStorage.getItem(
            'my-accountname'
        )}`;
    } else {
        alert('삭제 실패');
    }
}

function updatePost() {
    const postId = sessionStorage.getItem('targetPostId');

    location.href = `../pages/postUpload.html?postId=${postId}`;
}

async function deletePost() {
    const post = document.querySelector('.post-text');
    const postID = post.getAttribute('data-post-id');
    const res = await fetch(API_URL + `/post/${postID}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json();

    if (data) {
        location.href = `profile.html?userId=${sessionStorage.getItem(
            'my-accountname'
        )}`;
    } else {
        alert('삭제 실패');
    }
}

async function reportPost() {
    const post = document.querySelector('.post-text');
    const postID = post.getAttribute('data-post-id');

    try {
        const res = await fetch(`${API_URL}/post/${postID}/report`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-type': 'application/json',
            },
        });
        const data = await res.json();

        if (data.report) {
            alert('해당 게시글을 신고했습니다.');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('오류가 발생했습니다.');
    }
    location.reload();
}

async function reportComment() {
    const postId = getFromQueryString('postId');
    const commentId = sessionStorage.getItem('targetCommentId');

    try {
        const res = await fetch(
            `${API_URL}/post/${postId}/comments/${commentId}/report`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-type': 'application/json',
                },
            }
        );
        const data = await res.json();

        if (data.report) {
            alert('해당 댓글을 신고했습니다.');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('오류가 발생했습니다.');
    }
    location.reload();
}
