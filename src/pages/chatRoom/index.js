import './style.css';

import defaultProfileImage from '@images/default-profile-image.webp';

import { getProfile } from '@api';
import { ChatMessage, StatusBar } from '@components';
import { IMAGE } from '@constants';
import {
  attachImageURL,
  getFromQueryString,
  resizeTextarea,
  saveCurrentPageURL,
  validateImageFiles,
} from '@utils';

StatusBar();

const partnerId = getFromQueryString('accountname');

const messageSection = document.querySelector('.message-section');
const imageInput = document.querySelector('#image-attach-input');
const inputContainer = document.querySelector('.input-container');
const messageTextarea = document.querySelector('#message-textarea');
const messageForm = document.querySelector('#message-form');
const sendButton = document.querySelector('#send-button');

const initialPaddingBottom = window
  .getComputedStyle(messageSection)
  .getPropertyValue('padding-bottom')
  .split('px')
  .map(Number)[0];

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.borderBoxSize) {
      const changingHeight = entry.borderBoxSize[0].blockSize;
      messageSection.style.paddingBottom = `${
        initialPaddingBottom + changingHeight
      }px`;
      scrollToBottom();
    }
  }
});

document.addEventListener('DOMContentLoaded', scrollToBottom);

if (partnerId) printPartnerInfo(partnerId);

messageTextarea.addEventListener('input', () => {
  validateInput();
  resizeTextarea({ element: messageTextarea, threshold: 90 });
});

resizeObserver.observe(inputContainer);

messageTextarea.addEventListener('keydown', (e) => {
  if (!e.shiftKey && e.key === 'Enter') {
    e.preventDefault();
    sendButton.click();
  }
});

imageInput.addEventListener('input', (e) => {
  const imageFile = e.target.files;
  const { isValid, cause } = validateImageFiles(imageFile);

  if (isValid) sendAttachedImage(imageFile[0]);
  else alert(cause);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  messageSection.append(ChatMessage(e.target.message.value));
  messageTextarea.value = '';

  resizeTextarea({ element: messageTextarea, threshold: 90 });
  scrollToBottom();
  validateInput();
});

function scrollToBottom() {
  window.scrollTo(0, document.body.scrollHeight);
}

async function printPartnerInfo(partnerId) {
  const { ok, profile, error } = await getProfile(partnerId);

  if (ok) {
    const partnerName = document.querySelector('.chat-partner-name');
    partnerName.textContent = profile.username;

    const partnerImage = document.querySelector('.partner-image');
    partnerImage.src = attachImageURL({
      src: profile.image,
      ...IMAGE.size.user.sm,
    });
    partnerImage.onerror = ({ target }) => {
      target.onerror = null;
      target.src = defaultProfileImage;
    };
    saveCurrentPageURL();
  } else alert(error);
}

function validateInput() {
  const message = messageTextarea.value;
  const canSend = /\S+/.test(message);

  if (canSend) sendButton.disabled = false;
  else sendButton.disabled = true;
}

function sendAttachedImage(imageFile) {
  messageSection.append(ChatMessage(imageFile));

  scrollToBottom();
}
