import './style.css';

import defaultProfileImage from '@images/default-profile-image.webp';

import {
  getImageFileNames,
  getMyInfo,
  getPost,
  postPost,
  updatePost,
} from '@api';
import { ImageSlide, StatusBar } from '@components';
import { IMAGE, IMAGE_ERROR, PAGE } from '@constants';
import {
  attachImageURL,
  getFromQueryString,
  getImageDataURL,
  navigate,
  resizeTextarea,
  saveCurrentPageURL,
  scrollHorizontal,
  validateImageFiles,
} from '@utils';

const postId = getFromQueryString('postId');

const authorProfileImage = document.querySelector('#author-profile-image');
const postContentTextarea = document.querySelector('#post-content-textarea');
const postImageInput = document.querySelector('#post-image-input');
const imageList = document.querySelector('#image-list');
const uploadButton = document.querySelector('#upload-button');

let images = [];

StatusBar();
printAuthorImage();
formCheck();

if (postId) printPostData();
else saveCurrentPageURL();

postImageInput.addEventListener('change', ({ target: { files } }) => {
  const { isValid, cause } = validateImageFiles(files);

  if (isValid) {
    previewImage(files);
    formCheck();
  } else alert(cause);
});

imageList.addEventListener('wheel', (e) => scrollHorizontal(e, imageList));

imageList.addEventListener('click', ({ target }) => {
  if (target.tagName === 'BUTTON') {
    deleteImageSlide(target.closest('li'));
  }
});

postContentTextarea.addEventListener('input', () =>
  resizeTextarea({ element: postContentTextarea, threshold: 470 }),
);

postContentTextarea.addEventListener('input', formCheck);

function formCheck() {
  uploadButton.disabled = !(postContentTextarea.value && images.length);
}

uploadButton.addEventListener('click', upload);

async function printAuthorImage() {
  const { ok, user } = await getMyInfo();

  if (ok) {
    authorProfileImage.src = attachImageURL({
      src: user.image,
      ...IMAGE.size.user.sm,
    });
    authorProfileImage.alt = `${user.username}의 프로필 이미지`;
    authorProfileImage.onerror = ({ target }) => {
      target.onerror = null;
      target.src = defaultProfileImage;
    };
  }
}

async function printPostData() {
  const { ok, post, error } = await getPost(postId);

  if (!ok) {
    alert(error);
    navigate({ goBack: true, replace: true });
  }

  const { content, image } = post;

  postContentTextarea.value = content;

  images = image.split(',');
  printImageSlider(images);

  saveCurrentPageURL();
}

function printImageSlider(images) {
  for (const image of images) {
    imageList.append(ImageSlide(image));
  }
}

async function previewImage(files) {
  if (files.length + images.length > 3) {
    return alert(IMAGE_ERROR.count);
  }

  const imageURLs = [];
  for (const file of [...files]) {
    images.push(file);
    const imageDataURL = await getImageDataURL(file);
    imageURLs.push(imageDataURL);
  }
  printImageSlider(imageURLs);
}

function deleteImageSlide(target) {
  const nodes = imageList.childNodes;

  for (let i = 0; i < nodes.length; i += 1) {
    const currentNode = nodes[i];

    if (currentNode === target) {
      currentNode.remove();
      images.splice(i, 1);
      break;
    }
  }
}

async function upload() {
  const content = postContentTextarea.value;
  const image = await getImageFileNames(images);

  if (!image.ok) return alert(image.error);

  const post = { content, image: image.imageFileNames };
  const response = postId
    ? await updatePost(postId, post)
    : await postPost(post);

  if (response.ok) navigate({ to: PAGE.post(response.postId), replace: true });
  else alert(response.error);
}
