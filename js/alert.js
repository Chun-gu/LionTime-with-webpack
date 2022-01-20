const closeBtn = document.querySelector('.btn-closed');
const alertModal = document.querySelector('.alert');
const alertDimd = document.querySelector('.alert-dimd');
const POST_ID_ = location.href.split('?')[1];






closeBtn.addEventListener('click', () => {
    alertModal.classList.remove('on');
    alertDimd.classList.remove('on');
});

document.addEventListener('click', (e) => {
    if (e.target.classList.value === 'btn-list logOut') {
        createAlert('로그아웃하시겠어요?', '로그아웃', 'btn-logout');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (e.target.classList.value === 'btn-list delete') {
        createAlert('게시글을 삭제할까요?', '삭제', 'btn-delete');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if (e.target.classList.value === 'btn-list post-report') {
        createAlert('신고하시겠어요?', '신고', 'btn-report');

        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if(e.target.classList.value === 'btn-list productDelete'){
        createAlert('상품을 삭제할까요?','삭제','btn-product-delete');
        
        alertModal.classList.add('on');
        alertDimd.classList.add('on');
    } else if(e.target.classList.value ==='btn-list productUpdate'){
        updateProduct();
    } 
    else if(e.target.classList.value ==='btn-list update'){
        updatePost();
    }

    if (e.target.classList.value === 'btn-alert btn-logout') {
        sessionStorage.removeItem('my-id');
        sessionStorage.removeItem('my-token');
        sessionStorage.removeItem('my-accountname');

        location.href = 'login.html';
    } else if (e.target.classList.value === 'btn-alert btn-delete') {
        deletePost();
    } else if(e.target.classList.value === 'btn-alert btn-product-delete') {
        deleteProduct();
    }else if (e.target.classList.value === 'btn-alert btn-report') {
        reportPost();
    }
});

function createAlert(infoText, btnText, addClass) {
    document.querySelector('.txt-alert-message').innerText = infoText;
    document.querySelector('.btn-alert:last-child').innerText = btnText;
    document.querySelector('.btn-alert:last-child').classList.add(addClass);
}


function updateProduct(){
    const product = document.querySelector(".product-item");
    const productId = product.getAttribute("data-product-id");

    location.href = `../pages/productAdd.html?${productId}`;
}

async function deleteProduct() {
    const product = document.querySelector(".product-item");
    const productId = product.getAttribute("data-product-id");

    const res = await fetch(API_URL+`product/${productId}`,{
        method: 'DELETE',
        headers: {
            "Authorization" : `Bearer ${TOKEN}`,
	        "Content-type" : "application/json"
        },
    });
    const data = await res.json();

    if (data) {
        location.href = `profile.html?${sessionStorage.getItem('my-accountname')}`;
    } else {
        alert('삭제 실패');
    }
}

function updatePost(){
    const post = document.querySelector('.post-text');
    const postID =post.getAttribute("data-post-id");
    console.log(postID);

    location.href = `../pages/postUpload.html?${postID}`;
}

async function deletePost() {
    const post = document.querySelector('.post-text');
    const postID =post.getAttribute("data-post-id");
    const res = await fetch(API_URL+`post/${postID}`, {
        method: 'DELETE',
        headers: {
            "Authorization" : `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
    });
    const data = await res.json();
    console.log(data);

    if (data) {
        location.href = `profile.html?${sessionStorage.getItem('my-accountname')}`;
    } else {
        alert('삭제 실패');
    }
}

async function reportPost(){
    const post = document.querySelector('.post-text');
    const postID =post.getAttribute("data-post-id");
    const res = await fetch(API_URL+`post/${postID}/report`,{
        method:'POST',
        headers: {
            "Authorization" : `Bearer ${TOKEN}`,
	        "Content-type" : "application/json"
        },
    });
    const data = await res.json();
    if(data){
        location.reload();
    }else{
        alert('신고 실패');
    }
}