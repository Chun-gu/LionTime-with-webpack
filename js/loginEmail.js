// function getInput() {
//     console.log(document.querySelector("#idEmailInput").value)
//     console.log(document.querySelector("#loginPWInput").value)
// }

const email = document.querySelector('#idEmailInput');
const pw = document.querySelector('#loginPWInput');
const loginForm = document.querySelector('.loginForm');
const $loginBtn = document.querySelector('#submitBtn');
const errorMessage = document.querySelector('.loginError');
email.addEventListener('input', () => {
    if (email.value !== '') {
        if (pw.value !== '') {
            $loginBtn.disabled = false;
        } else {
            $loginBtn.disabled = true;
        }
    } else {
        $loginBtn.disabled = true;
    }
});

pw.addEventListener('input', () => {
    if (pw.value !== '') {
        if (email.value !== '') {
            $loginBtn.disabled = false;
        } else {
            $loginBtn.disabled = true;
        }
    } else {
        $loginBtn.disabled = true;
    }
});

// 비동기로 동하는것을 명시해줘야 await을 할 수 있다!
async function login() {
    const email = document.querySelector('#idEmailInput').value;
    const pw = document.querySelector('#loginPWInput').value;
    const url = 'http://146.56.183.55:5050';
    const loginData = {
        user: {
            email: email,
            password: pw,
        },
    };

    const res = await fetch(url + '/user/login', {
        //메소드 구분
        method: 'POST',
        //헤더
        headers: {
            'Content-type': 'application/json',
        },
        //이건 오브잭트를 문자열로 바꿔주는 부분
        body: JSON.stringify(loginData),
    });
    const json = await res.json(); //외않됌? 포인트 res.json()도 비동기. await을 해줘야한다.
    console.log(json);
    // console.log(json.user.token);
    // console.log(json.user.accountname);
    if (json.message === '이메일 또는 비밀번호가 일치하지 않습니다.') {
        errorMessage.innerText = '*이메일 또는 비밀번호가 일치하지 않습니다.';
    } else {
        sessionStorage.setItem('my-token', json.user.token);
        sessionStorage.setItem('my-id', json.user._id);
        sessionStorage.setItem('my-accountname', json.user.accountname);
        location.href = 'home.html';
    }
}

// blur, disable 풀기

$loginBtn.addEventListener('click', login);
