import { API_URL, IMAGE_URL } from './key.js';
import { getFromQueryString } from './lib.js';
const TOKEN = sessionStorage.getItem('my-token');
const POST_ID = getFromQueryString('postId');

const postContentInput = document.querySelector('.inp-post');
const imageContainer = document.querySelector('.img-container');
const row = document.querySelector('.row');

let inpFile;
let imageNames = [];

// 뒤로가기
const btnBack = document.querySelector('.btn-back');
btnBack.addEventListener('click', () => {
    history.back();
});

// 게시글 수정이면 기존 게시글 정보 불러오기
if (POST_ID) {
    getPostData();
}

async function getPostData() {
    try {
        const res = await fetch(`${API_URL}/post/${POST_ID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
        });
        const data = await res.json();

        printPostData(data);
    } catch (error) {
        alert('기존 게시글 정보를 불러오는데 실패했습니다.');
    }
}

function printPostData(data) {
    const {
        post: { content, image },
    } = data;

    postContentInput.value = content;
    imageNames = image.split(',');
    for (const imageName of imageNames) {
        row.innerHTML += `
                <div>
                    <img class="image" style="width: 168px; height: 126px" src=${
                        IMAGE_URL + imageName
                    } alt="업로드 이미지">
                    <div class="btnX"></div>
                </div>`;
    }

    resizeImageContainer(imageNames.length);
    btnRemove(imageNames);
    imgSlider();
}

// POST
const inpText = document.querySelector('.inp-post');

// 게시글 이미지 미리보기
const postImageInput = document.querySelector('#img-upload');
postImageInput.addEventListener('change', (e) => {
    previewImage(e.target.files);
    formCheck();
});

// 업로드 이미지 미리보기 (image upload preview)
function previewImage(imageFiles) {
    inpFile = imageFiles;

    // 업로드 다시할 떄 기존 자식태그 삭제
    while (row.hasChildNodes()) {
        row.removeChild(row.firstChild);
    }
    imageNames = [];

    const fileArr = Array.from(imageFiles);

    if (fileArr.length + imageNames.length > 3) {
        return alert('최대 3개까지 업로드 가능합니다');
    }

    if (imageFiles.length) {
        fileArr.forEach((file) => {
            const reader = new FileReader();
            const imgDiv = document.createElement('div');
            const btnX = document.createElement('div');
            const img = document.createElement('img');
            btnX.classList.add('btnX');
            img.classList.add('image');

            imgDiv.appendChild(img);
            imgDiv.appendChild(btnX);

            reader.onload = (e) => {
                img.src = e.target.result;
                if (imageFiles.length + imageNames.length > 1) {
                    imgDiv.firstChild.style.width = '168px';
                    imgDiv.firstChild.style.height = '126px';
                } else {
                    imgDiv.firstChild.style.width = '304px';
                    imgDiv.firstChild.style.height = '228px';
                }
            };
            row.appendChild(imgDiv);
            reader.readAsDataURL(file);
        });
        imageContainer.appendChild(row);
    }

    btnRemove(fileArr);
    resizeImageContainer(fileArr.length + imageNames.length);
    imgSlider();
}

// 업로드 이미지 슬라이더
function imgSlider() {
    let slider = document.querySelector('.img-container');

    slider.addEventListener('wheel', (e) => {
        const { scrollLeft, clientWidth, scrollWidth } = slider;
        // scrollWidth(1500) = clientWidth(370) + scrollLeft(0~1130)
        if (scrollLeft === 0 && e.deltaY < 0) {
            return false;
        }
        if (scrollLeft + clientWidth >= scrollWidth && e.deltaY > 0) {
            return false;
        }
        e.preventDefault();
        slider.scrollBy({
            left: e.deltaY < 0 ? -100 : 100,
        });
    });
}

// 이미지 개수별 img-container 크기
function resizeImageContainer(imagesCount) {
    if (imagesCount === 0) {
        postImageInput.value = '';
    } else if (imagesCount === 1) {
        imageContainer.style.height = '228px';
        row.style.width = '304px';
        row.style.height = '228px';
        document.querySelector('.image').style.width = '304px';
        document.querySelector('.image').style.height = '228px';
    } else if (imagesCount === 2) {
        imageContainer.style.height = '126px';
        row.style.width = '344px';
        row.style.height = '126px';
    } else if (imagesCount === 3) {
        imageContainer.style.height = '126px';
        row.style.width = '520px';
        row.style.height = '126px';
    }
}

// remove upload image
function btnRemove(imgArr) {
    const btnDel = document.querySelectorAll('.btnX');
    let btnDelArr = Array.prototype.slice.call(btnDel);
    btnDel.forEach((element) => {
        element.addEventListener('click', (e) => {
            const delIndex = btnDelArr.indexOf(element);
            element.parentNode.remove();
            imgArr.splice(delIndex, 1);
            btnDelArr.splice(delIndex, 1);
            resizeImageContainer(btnDelArr.length);
            formCheck();
        });
    });
}

// textarea 높이 자동 조절
const textArea = document.querySelector('#txt-post');
textArea.addEventListener('input', (e) => resizeTextArea(e));

function resizeTextArea(e) {
    textArea.style.height = 'auto';
    const scrollHeight = e.target.scrollHeight;
    textArea.style.height = `${scrollHeight}px`;
    if (scrollHeight < 470) textArea.style.overflowY = 'hidden';
    if (scrollHeight >= 470) textArea.style.overflowY = 'scroll';
}

// 입력 값 체크, 버튼 활성화
const inpPost = document.querySelector('.inp-post');
const btnUpload = document.querySelector('.btn-upload');

formCheck();
inpPost.addEventListener('input', () => {
    formCheck();
});

function formCheck() {
    if (inpPost.value && (postImageInput.value || imageNames.length)) {
        btnUpload.disabled = false;
    } else {
        btnUpload.disabled = true;
    }
}

// 업로드 버튼 클릭
btnUpload.addEventListener('click', (e) => {
    e.preventDefault();
    POST_ID ? addUpdatePost('UPDATE') : addUpdatePost('ADD');
});

// 게시글 등록 또는 추가
async function addUpdatePost(mode) {
    const imageFileName = await getImageFileName();
    const content = inpText.value;

    const method = {
        ADD: 'POST',
        UPDATE: 'PUT',
    };
    const behavior = {
        ADD: '작성',
        UPDATE: '수정',
    };
    const postId = mode === 'UPDATE' ? POST_ID : '';

    try {
        const res = await fetch(`${API_URL}/post/${postId}`, {
            method: method[mode],
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify({
                post: {
                    content,
                    image: imageFileName,
                },
            }),
        });

        const { post } = await res.json();

        if (post) {
            alert(`게시글 ${behavior[mode]}이 완료되었습니다.`);
            history.replaceState(
                null,
                null,
                `../pages/post.html?postId=${post.id}`
            );
            location.reload();
        } else {
            alert(`게시글 ${behavior[mode]}에 실패했습니다.`);
        }
    } catch (error) {
        alert(`게시글 ${behavior[mode]}에 실패했습니다.`);
    }
}

// 이미지 서버로 전송, filename 값 가져오기
async function getImageFileName() {
    if (imageNames.length > 1) {
        return imageNames.join(',');
    } else if (imageNames.length === 1) {
        return imageNames[0];
    }

    let formData = new FormData();
    for (const file of inpFile) {
        formData.append('image', file);
    }
    const res = await fetch(`${API_URL}/image/uploadfiles`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
        },
        body: formData,
    });
    const fileInfos = await res.json();
    const fileName = fileInfos.map((info) => info.filename).join(',');

    return fileName;
}
