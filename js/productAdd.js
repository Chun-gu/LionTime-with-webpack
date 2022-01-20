const TOKEN = sessionStorage.getItem('my-token');
const PRODUCT_ID = location.href.split('?')[1];

// 0. 뒤로가기
const btnBack = document.querySelector('.btn-back');
btnBack.addEventListener('click', () => {
    history.back();
});

// 1. input file - image upload preview
const inpImage = document.querySelector('#img-product');
const previewImage = document.querySelector('.img-preview');
let checkImg = false;

function readImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        // 이미지가 로드가 된 경우
        reader.onload = (e) => {
            previewImage.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        previewImage.src = '../images/img-preview.png';
    }
}

inpImage.addEventListener('input', (e) => {
    checkImg = true;
    readImage(e.target);
    formCheck();
});

// 2. form 태그 내부값 체크, 버튼 활성화
const inpName = document.querySelector('.inp-name');
const inpPrice = document.querySelector('.inp-price');
const inpLink = document.querySelector('.inp-link');
const btnSave = document.querySelector('.btn-save');

function formCheck() {
    if (
        inpName.value &&
        inpPrice.value &&
        inpLink.value &&
        (inpImage.value || previewImage.src.split('-')[1] !== 'preview.png')
    ) {
        console.log('버튼 활성화');
        btnSave.disabled = false;
    } else {
        btnSave.disabled = true;
    }
}

inpName.addEventListener('input', (e) => {
    formCheck();
});
inpPrice.addEventListener('input', (e) => {
    formCheck();
});
inpLink.addEventListener('input', (e) => {
    formCheck();
});

// 3. 가격 1000 단위 컴마 찍기
function comma(str) {
    return str.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}
function uncomma(str) {
    return str.replace(/[^\d]+/g, '');
}

inpPrice.addEventListener('input', (e) => {
    e.target.value = comma(uncomma(e.target.value));
});

// 5. api 서버로 데이터 전송 (상품 등록)
async function postData() {
    const imgName = await imgData();
    const itemName = inpName.value;
    const price = parseInt(uncomma(inpPrice.value));
    const link = inpLink.value;
    const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');

    const res = await fetch('http://146.56.183.55:5050/product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
            product: {
                itemName: itemName,
                price: price,
                link: link,
                itemImage: `http://146.56.183.55:5050/${imgName.filename}`,
            },
        }),
    });
    const json = await res.json();
    if (json.product) {
        alert('업로드 성공');
        location.href = `/pages/profile.html?${MY_ACCOUNTNAME}`;
    } else {
        alert('업로드 실패');
    }
}

// 6. 이미지 서버 전달, 새 파일이름 받기
async function imgData() {
    let formData = new FormData();
    formData.append('image', inpImage.files[0]);
    const res = await fetch('http://146.56.183.55:5050/image/uploadfile', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
        body: formData,
    });
    const data = await res.json();
    return data;
}

btnSave.addEventListener('click', (e) => {
    if (PRODUCT_ID) {
        putData();
    } else {
        postData();
    }
});

// 7. status bar 시간
const timeStatus = document.querySelector('.text-current-time');
(function timeNow() {
    const date = new Date();
    const hour = date.getHours();
    const min = date.getMinutes();
    if (hour > 12) {
        timeStatus.textContent = `${hour - 12}:${min} PM`;
    } else {
        timeStatus.textContent = `${hour}:${min} AM`;
    }
})();

// 8. 상품 수정
if (PRODUCT_ID) {
    getProductData();
}

async function getProductData() {
    const res = await fetch(
        `http://146.56.183.55:5050/product/detail/${PRODUCT_ID}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        }
    );
    const data = await res.json();
    previewImage.src = data.product.itemImage;
    inpName.value = data.product.itemName;
    inpPrice.value = data.product.price;
    inpLink.value = data.product.link;
}

async function putData() {
    let imgLink;
    if (checkImg) {
        const imgName = await imgData();
        imgLink = `http://146.56.183.55:5050/${imgName.filename}`;
    } else {
        imgLink = previewImage.src;
    }
    const itemName = inpName.value;
    const price = parseInt(uncomma(inpPrice.value));
    const link = inpLink.value;
    const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');

    const res = await fetch(`http://146.56.183.55:5050/product/${PRODUCT_ID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
            product: {
                itemName: itemName,
                price: price,
                link: link,
                itemImage: imgLink,
            },
        }),
    });
    const data = await res.json();
    if (data.product) {
        alert('업로드 성공');
        location.href = `/pages/profile.html?${MY_ACCOUNTNAME}`;
    } else {
        alert('업로드 실패');
    }
}
