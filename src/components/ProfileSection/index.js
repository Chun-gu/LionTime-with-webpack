import styles from './style.module.css';

import defaultProfileImage from '@images/default-profile-image.webp';

import { trimImageURL } from '@utils';

export default function ProfileSection({ profile, isMyProfile, myId }) {
  const {
    username,
    accountname,
    intro,
    image,
    follower,
    followerCount,
    followingCount,
  } = profile;

  const isFollowing = follower.includes(myId);

  return `
  <h2 class="sr-only">${username} 님의 프로필</h2>
  <div class=${styles['profile-upper']}>
    <div class=${styles['profile-image-wrapper']}>
      <img 
        id="profile-image"
        src=${trimImageURL(image)} 
        onerror="this.onerror=null; this.src=${defaultProfileImage}"
      >
    </div>
    <div class=${styles['followers']}>
      <span class="sr-only">팔로워</span>
      <a href="profileFollow?accountname=${accountname}&page=follower" 
        class=${styles['followers-count']}>
        ${followerCount}
      </a>
      <span class="sr-only">명</span>
      <span aria-hidden="true">followers</span>
    </div>
    <div class=${styles['followings']}>
      <span class="sr-only">팔로잉</span>
      <a href="profileFollow?accountname=${accountname}&page=following"
        class=${styles['followings-count']}>
        ${followingCount}
      </a>
      <span class="sr-only">명</span>
      <span aria-hidden="true">followings</span>
    </div>
  </div>
  <div class=${styles['profile-bottom']}>
    <strong class=${styles['username']}>${username}</strong>
    <span class=${styles['accountname']}>@ ${accountname}</span>
    <p class=${styles['intro']}>${intro}</p>
  </div>
  <div>
  ${
    isMyProfile
      ? `
    <a href="profileModification" class="${styles['tablet-shape-button']}">
      프로필 수정
    </a>
    <a href="productUpload" class="${styles['tablet-shape-button']}">
      상품 등록
    </a>`
      : `
    <a href="chatRoom?accountname=${accountname}"
      class="${styles['round-button']} ${styles['chat-button']}">
      <span class="sr-only">채팅하기</span>
    </a>
    <button 
      id="follow-button"
      class="${styles['follow-button']} ${styles['tablet-shape-button']}" 
      data-is-following="${isFollowing}">
      ${isFollowing ? '언팔로우' : '팔로우'}
    </button>
    <button class="${styles['round-button']} ${styles['share-button']}">
      <span class="sr-only">공유하기</span>
    </button>`
  }
  </div>`;
}
