import { API_URL } from './key.js';
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
        createAlert('신고하시겠어요?', '신고', 'btn-report');

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
    } else if (classList === 'btn-alert btn-report') {
        reportPost();
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
    const post = document.querySelector('.post-text');
    const postID = post.getAttribute('data-post-id');

    location.href = `../pages/postUpload.html?postId=${postID}`;
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
    const res = await fetch(API_URL + `/post/${postID}/report`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-type': 'application/json',
        },
    });
    const data = await res.json();
    if (data) {
        location.reload();
    } else {
        alert('신고 실패');
    }
}
