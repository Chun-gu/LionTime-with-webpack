import './style.css';

import {
  getComments,
  getMyInfo,
  getPost,
  heartPost,
  postComment,
  unheartPost,
} from '@api';
import { Comment, PostItem, StatusBar } from '@components';
import {
  getFromQueryString,
  intersectionObserver,
  navigate,
  saveCurrentPageURL,
  attachImageURL,
} from '@utils';

const MY_ACCOUNTNAME = sessionStorage.getItem('my-accountname');
const postId = getFromQueryString('postId');

const LIMIT = 10;
let skip = 0;

const postSection = document.querySelector('#post-section');
const commentsList = document.querySelector('#comments-list');
const myProfileImage = document.querySelector('#my-profile-image');
const commentForm = document.querySelector('#comment-form');
const commentInput = document.querySelector('#comment-input');
const submitButton = document.querySelector('#submit-button');

const commentsListObserver = intersectionObserver(commentsList);
let BottomSheet;

StatusBar();
initializePage();

// 게시글 영역 이벤트
postSection.addEventListener('mouseover', importBottomSheet);

postSection.addEventListener('click', async ({ target }) => {
  const targetClassList = target.classList;

  if (targetClassList.contains('post-menu-button')) {
    const isMine =
      target.closest('.post-card').dataset.author === MY_ACCOUNTNAME;

    new BottomSheet({ type: 'post', postId, isMine }).open();
  }

  if (targetClassList.contains('heart-button')) {
    const heartCount = target.nextElementSibling;
    const isHearted = JSON.parse(target.dataset.hearted);

    const { ok, error } = isHearted
      ? await unheartPost(postId)
      : await heartPost(postId);

    if (ok) {
      target.dataset.hearted = !isHearted;
      heartCount.textContent =
        parseInt(heartCount.textContent) + (isHearted ? -1 : 1);
    } else alert(error);
  }
});

// 댓글 입력 이벤트
commentInput.addEventListener('input', ({ target }) => {
  validateCommentInput(target.value);
});

// 댓글 등록 이벤트
// TODO: 새로운 댓글을 작성했을 때 캐싱된 기존 댓글 내용 가져오기
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const content = commentInput.value;
  const { ok, error } = await postComment(postId, content);

  if (ok) {
    commentsList.innerHTML = '';
    commentInput.value = '';
    skip = 0;
    await printComments();
    validateCommentInput(commentInput.value);
  } else alert(error);
});

// 댓글 영역 이벤트
commentsList.addEventListener('intersect', printComments);

commentsList.addEventListener('mouseover', importBottomSheet);

commentsList.addEventListener('click', ({ target }) => {
  if (target.classList.contains('comment-menu-button')) {
    const comment = target.closest('.comment');
    const commentId = comment.dataset.commentId;
    const isMine = comment.dataset.author === MY_ACCOUNTNAME;

    new BottomSheet({ type: 'comment', postId, commentId, isMine }).open();
  }
});

async function initializePage() {
  const requests = [
    getPost(postId),
    getComments({ postId, LIMIT, skip }),
    getMyInfo(),
  ];
  const [post, comments, myInfo] = await Promise.all(requests);

  if (post.ok) postSection.append(PostItem({ post: post.post, page: 'post' }));
  else {
    alert(post.error);
    return navigate({ goBack: true, replace: true });
  }

  if (comments.ok) appendComments(comments.comments);
  else alert(comments.error);

  if (myInfo.ok) myProfileImage.src = attachImageURL(myInfo.user.image);
  else alert(myInfo.error);

  saveCurrentPageURL();
}

async function printComments() {
  const { ok, comments, error } = await getComments({ postId, LIMIT, skip });

  if (ok) appendComments(comments);
  else alert(error);
}

function appendComments(comments) {
  if (comments.length === 0) {
    commentsListObserver.disconnect();
    commentsList.removeEventListener('intersect', printComments);
  } else if (comments.length < LIMIT) {
    comments.forEach((comment) => commentsList.append(Comment(comment)));
    commentsListObserver.disconnect();
    commentsList.removeEventListener('intersect', printComments);
  } else {
    skip += LIMIT;
    comments.forEach((comment) => commentsList.append(Comment(comment)));
    commentsListObserver.observe(commentsList.lastChild);
  }
}

function validateCommentInput(value) {
  const isValid = /\S+/.test(value);
  submitButton.disabled = !isValid;
}

async function importBottomSheet(event) {
  if (event.target.classList.contains('menu-button')) {
    const module = await import(
      /* webpackChunkName: "BottomSheet" */ '@components/BottomSheet'
    );
    BottomSheet = module.default;

    event.currentTarget?.removeEventListener('mouseover', importBottomSheet);
  }
}
