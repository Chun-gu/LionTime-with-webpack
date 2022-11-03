import { API_URL, IMAGE_URL } from './key.js';
import { getFromQueryString } from './lib.js';

const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const TOKEN = sessionStorage.getItem('my-token');
const PRODUCT_ID = getFromQueryString('productId');

// 뒤로가기
const btnBack = document.querySelector('.btn-back');
btnBack.addEventListener('click', () => {
    history.back();
});

// 상품 수정이면 기존 데이터 불러오기
if (PRODUCT_ID) {
    getProductData();
}

async function getProductData() {
    try {
        const res = await fetch(`${API_URL}/product/detail/${PRODUCT_ID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const {
            product: { itemName, price, link, itemImage },
        } = await res.json();

        productNameInput.value = itemName;
        priceInput.value = price;
        linkInput.value = link;
        imagePreview.src = IMAGE_URL + itemImage;
    } catch (error) {
        alert('기존 상품 정보를 불러오지 못했습니다.');
    }
}

// 상품 이미지 미리보기
const productImageInput = document.querySelector('#img-product');
const imagePreview = document.querySelector('.img-preview');

productImageInput.addEventListener('change', async (e) => {
    const allowedImageType = [
        'image/png',
        'image/jpg',
        'image/gif',
        'image/jpeg',
    ];
    const imageFile = e.target.files[0];

    if (imageFile.size > 1024 * 1024 * 3) {
        alert('이미지의 크기가 3MB를 초과했습니다.');
        return;
    }

    if (!allowedImageType.includes(imageFile.type)) {
        alert('jpg, gif, png, jpeg 형식의 이미지만 등록할 수 있습니다.');
        return;
    }

    previewImage(imageFile);
    formCheck();
});

function previewImage(imageFile) {
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
    } else {
        imagePreview.src = '../images/img-preview.png';
    }
}

// form 태그 내부값 체크, 버튼 활성화
const productNameInput = document.querySelector('.inp-name');
const priceInput = document.querySelector('.inp-price');
const linkInput = document.querySelector('.inp-link');
const btnSave = document.querySelector('.btn-save');

productNameInput.addEventListener('input', () => {
    formCheck();
});
priceInput.addEventListener('input', () => {
    formCheck();
});
linkInput.addEventListener('input', () => {
    formCheck();
});

function formCheck() {
    if (
        productNameInput.value &&
        priceInput.value &&
        linkInput.value &&
        (productImageInput.value || imagePreview.src)
    ) {
        btnSave.disabled = false;
    } else {
        btnSave.disabled = true;
    }
}

// 가격 1000 단위 콤마 찍기
priceInput.addEventListener('input', (e) => {
    e.target.value = comma(uncomma(e.target.value));
});

function comma(str) {
    return str.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
}
function uncomma(str) {
    return str.replace(/[^\d]+/g, '');
}

// 저장 버튼 클릭
btnSave.addEventListener('click', () => {
    PRODUCT_ID ? addUpdateProduct('UPDATE') : addUpdateProduct('ADD');
});

// 상품 등록 또는 수정
async function addUpdateProduct(mode) {
    const itemName = productNameInput.value;
    const price = parseInt(uncomma(priceInput.value));
    const link = linkInput.value;
    const imageFile = productImageInput.files[0];
    const { filename: itemImage } = await getImageFileName(imageFile);

    const method = {
        ADD: 'POST',
        UPDATE: 'PUT',
    };
    const behavior = {
        ADD: '등록',
        UPDATE: '수정',
    };
    const productId = mode === 'UPDATE' ? PRODUCT_ID : '';

    try {
        const res = await fetch(`${API_URL}/product/${productId}`, {
            method: method[mode],
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                product: {
                    itemName,
                    price,
                    link,
                    itemImage,
                },
            }),
        });

        const { product } = await res.json();

        if (product) {
            alert(`상품 ${behavior[mode]}이 완료되었습니다.`);
            history.replaceState(
                null,
                null,
                `/pages/profile.html?userId=${MY_ACCOUNTNAME}`
            );
            location.reload();
        } else {
            alert(`상품 ${behavior[mode]}에 실패했습니다.`);
        }
    } catch (error) {
        alert(`상품 ${behavior[mode]}에 실패했습니다.`);
    }
}

// 서버로부터 이미지 파일 이름 받기
async function getImageFileName(imageFile) {
    let formData = new FormData();
    formData.append('image', imageFile);

    try {
        const res = await fetch(`${API_URL}/image/uploadfile`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            body: formData,
        });

        const data = await res.json();

        return data;
    } catch (error) {
        alert('이미지 정보를 불러오는데 실패했습니다.');
    }
}
