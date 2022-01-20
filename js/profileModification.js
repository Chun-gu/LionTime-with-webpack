const API_URL = 'http://146.56.183.55:5050/';
const isLogin = !!sessionStorage.getItem('my-token');
const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const TOKEN = sessionStorage.getItem('my-token');

let email = '';
let password = '';

// 로그인 상태 파악
if (isLogin) {
    const joinHeader = document.querySelector('.join-header');
    joinHeader.remove();
    const joinBtn = document.querySelector('.btn-join');
    joinBtn.remove();
    printProfile();
} else {
    email = localStorage.getItem('email');
    localStorage.removeItem('email');
    password = localStorage.getItem('password');
    localStorage.removeItem('password');
    const modHeader = document.querySelector('.mod-header');
    modHeader.remove();
    const modTitle = document.querySelector('.mod-title');
    modTitle.remove();
    const saveBtn = document.querySelector('.btn-save');
    saveBtn.remove();
}
const previewImg = document.querySelector('.userImg-preview');
const inputName = document.querySelector('#input-username');
const inputId = document.querySelector('#input-userId');
const inputIntro = document.querySelector('#input-intro');

// 본인 프로필 내역 출력
async function printProfile() {
    const endpoint = `profile/${MY_ACCOUNTNAME}`;
    const data = await fetchData(endpoint);
    const profileData = data.profile;
    const { username, accountname, intro, image } = profileData;
    const isImage = !!image.match(/^http\:\/\/146\.56\.183\.55/, 'i');
    if (!!image.match(/^http\:\/\/146\.56\.183\.55/, 'i')) {
        previewImg.src = image;
    } else {
        previewImg.src = API_URL + image;
    }
    inputName.value = username;
    inputId.value = accountname;
    inputIntro.value = intro;
}

async function fetchData(endpoint) {
    try {
        const res = await fetch(API_URL + endpoint, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
            },
        });
        const resJson = await res.json();
        return resJson;
    } catch (err) {
        console.log(err);
    }
}

// 프로필 이미지 미리보기
const inputImg = document.querySelector('#input-userImg');
inputImg.addEventListener('change', async (e) => {
    preview(e.target);
    const bgImg = document.querySelector('.userImg');
    bgImg.classList.add('hasImg');
});
function preview(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// 사용자 이름 검증
const invalidName = document.querySelector('.invalid-username');
let isValidName = false;
inputName.addEventListener('blur', (e) => {
    isValidName = validateName(e.target.value);
    isSubmittable();
});

function validateName(name) {
    if (name.length < 2 || name.length > 10) {
        invalidName.textContent = '*2~10자 이내여야 합니다.';
        inputName.classList.add('invalid');
        return false;
    } else if (name.match(/^\s|\s{2,}|\s$/, 'g')) {
        invalidName.textContent =
            '*시작과 끝이 공백이거나, 연속된 공백을 넣을 수 없습니다.';
        inputName.classList.add('invalid');
        return false;
    } else {
        invalidName.textContent = '';
        inputName.classList.remove('invalid');
        return true;
    }
}

// 계정 ID 검증 (중복 불가)
const invalidId = document.querySelector('.invalid-userId');
let isValidId = false;
inputId.addEventListener('blur', async (e) => {
    isValidId = await validateId(e.target.value);
    isSubmittable();
});

async function validateId(id) {
    if (inputId.value.length === 0 || id.match(/[^a-z0-9\.\_]/, 'gi')) {
        invalidId.textContent =
            '*영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.';
        inputId.classList.add('invalid');
        return false;
    } else {
        const isExist = await checkDuplicateId(id);
        console.log(isExist);
        if (isExist) {
            invalidId.textContent = '이미 사용 중인 ID입니다.';
            inputId.classList.add('invalid');
            return false;
        } else {
            invalidId.textContent = '';
            inputId.classList.remove('invalid');
            return true;
        }
    }
}

async function checkDuplicateId(accountname) {
    try {
        const res = await fetch(API_URL + 'user/accountnamevalid', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: {
                    accountname,
                },
            }),
        });
        const resJson = await res.json();
        console.log(resJson.message);
        return resJson.message === '사용 가능한 계정ID 입니다.' ? false : true;
    } catch (err) {
        console.log(err);
    }
}

// submit 버튼 활성화
const submitBtn = document.querySelectorAll('.btn-submit');
function isSubmittable() {
    if (isValidName && isValidId) {
        submitBtn.forEach((elem) => {
            elem.disabled = false;
        });
    } else {
        submitBtn.forEach((elem) => {
            elem.disabled = true;
        });
    }
}

// 업로드하려는 이미지 filename 받아오기
async function getFileName(files) {
    const formData = new FormData();
    formData.append('image', files[0]); //formData.append("키이름","값")
    const res = await fetch(API_URL + 'image/uploadfile', {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    const fileName = data['filename'];
    return fileName;
}

if (isLogin) {
    //  프로필 수정 버튼 클릭
    const saveBtn = document.querySelector('.btn-save');
    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = inputName.value;
        const accountname = inputId.value;
        const intro = inputIntro.value;
        let image = '';
        if (inputImg.files.length !== 0) {
            const fileName = await getFileName(inputImg.files);
            image = fileName;
        } else {
            image = previewImg.src.split('/')[3];
        }
        try {
            const res = await fetch(API_URL + 'user', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        username,
                        accountname,
                        intro,
                        image,
                    },
                }),
            });
            const resJson = await res.json();
            const { accountname: modifiedAccountname } = resJson.user;
            sessionStorage.setItem('my-accountname', modifiedAccountname);
            location.href = `../pages/profile.html?${modifiedAccountname}`;
        } catch (err) {
            console.log(err);
        }
    });
} else {
    // 시작하기 버튼 클릭
    const joinBtn = document.querySelector('.btn-join');
    joinBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const username = inputName.value;
        const accountname = inputId.value;
        const intro = inputIntro.value;
        let image = '';
        if (inputImg.files.length !== 0) {
            const fileName = await getFileName(inputImg.files);
            image = fileName;
        }
        try {
            const res = await fetch(API_URL + 'user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: {
                        email,
                        password,
                        username,
                        accountname,
                        intro,
                        image,
                    },
                }),
            });
            const resJson = await res.json();
            if (resJson.message === '회원가입 성공') {
                location.href = '../pages/login.html';
            }
        } catch (err) {
            console.log(err);
        }
    });
}
