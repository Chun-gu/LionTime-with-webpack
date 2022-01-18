const closeBtn = document.querySelector('.btn-closed');
const alertModal = document.querySelector('.alert');
const alertDimd = document.querySelector('.alert-dimd');

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
    }

    if (e.target.classList.value === 'btn-alert btn-logout') {
        //로그인한 계정
        sessionStorage.removeItem('Token');
        sessionStorage.removeItem('_id');
        sessionStorage.removeItem('accountname');

        //임시계정..나중에 처리
        sessionStorage.removeItem('my-id');
        sessionStorage.removeItem('my-token');
        sessionStorage.removeItem('my-accountname');

        location.href = 'login.html';
    } else if (e.target.classList.value === 'btn-alert btn-delete') {
        console.log('게시글 삭제');
    } else if (e.target.classList.value === 'btn-alert btn-report') {
        console.log('신고!!');
    }
});

function createAlert(infoText, btnText, addClass) {
    document.querySelector('.txt-alert-message').innerText = infoText;
    document.querySelector('.btn-alert:last-child').innerText = btnText;
    document.querySelector('.btn-alert:last-child').classList.add(addClass);
}
