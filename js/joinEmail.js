// const TOKEN = sessionStorage.getItem("Token")

// console.log(TOKEN)

const inputEmail = document.querySelector('#emailInput');
const errorEmail = document.querySelector('.emailMessage');
let isEmailValid = false;
inputEmail.addEventListener('blur', async (event) => {
    console.log(event.target.value);
    const email = event.target.value;
    isEmailValid = await validateEmail(email);
    console.log('isEmailValid', isEmailValid);
    isSubmittable();
});

// 이메일 검증
async function validateEmail(email) {
    const regExp =
        /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/;
    console.log(email.match(regExp, 'i'));
    if (email.length === 0 || email.match(regExp) === null) {
        errorEmail.textContent = '*이메일 형식이 아닙니다';
        return false;
    } else {
        errorEmail.textContent = '';
        const isEmailExist = await checkEmailExist(email);
        console.log('isExist', isEmailExist);
        if (isEmailExist === true) {
            errorEmail.style.color = 'red';
            errorEmail.textContent = `*이미 가입된 이메일 주소입니다.`;
            return false;
        } else {
            return true;
        }
    }
}

//  이메일 중복 검사
async function checkEmailExist(email) {
    const res = await fetch('http://146.56.183.55:5050/user/emailvalid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: {
                email: email,
            },
        }),
    });

    const json = await res.json();
    console.log(json);
    return json.message == '사용 가능한 이메일 입니다.' ? false : true;
}
// 비밀번호 검사
const inputPW = document.querySelector('#pwInput');
const errorPassword = document.querySelector('.passwordMessage');
let isPasswordValid = false;
inputPW.addEventListener('blur', (event) => {
    const password = event.target.value;
    console.log(event.target.value);
    isPasswordValid = validatePW(password);
    console.log(isPasswordValid);
    isSubmittable();
});
function validatePW(password) {
    // const pwValid = inputPW.length < 6;
    if (password.length < 6) {
        console.log('비밀번호는 6자 이상이어야 합니다!');
        errorPassword.textContent = '비밀번호는 6자 이상이어야 합니다';
        return false;
    } else {
        errorPassword.textContent = '';
        return true;
    }
}
const nextBtn = document.querySelector('#nextBtn');
function isSubmittable() {
    console.log(isEmailValid, isPasswordValid);
    // isEmailValid === true && isPasswordValid === true면은 isFormValid가 true
    // isFormValid가 true라면 다음 버튼 활성화}
    if (isEmailValid && isPasswordValid) {
        nextBtn.disabled = false;
    } else {
        nextBtn.disabled = true;
    }
}

nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.setItem('email', inputEmail.value);
    localStorage.setItem('password', inputPW.value);
    location.href = '../pages/profileModification.html';
});
