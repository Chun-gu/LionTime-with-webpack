import { API_URL } from './key.js';
import { getFromQueryString, trimImageURL } from './lib.js';

const TOKEN = sessionStorage.getItem('my-token');
const partnerId = getFromQueryString('userId');

const messageSection = document.querySelector('.message-section');
const imageInput = document.querySelector('#image-attach-input');
const inputContainer = document.querySelector('.input-container');
const messageTextarea = document.querySelector('#message-textarea');
const messageForm = document.querySelector('#message-form');
const sendButton = document.querySelector('#send-button');

document.addEventListener('DOMContentLoaded', scrollToBottom);

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight);
}

const backKeyBtn = document.querySelector('.btn-back-key');
const currentTime = document.querySelector('.text-current-time');

inputText.addEventListener('input', () => {
    if (inputText.value !== '') {
        messageSendBtn.classList.add('change-color');
    } else {
        messageSendBtn.classList.remove('change-color');
    }
});

backKeyBtn.addEventListener('click', () => {
    history.back();
});

function currentTimer() {
    let date = new Date();
    currentTime.innerText = `${date.getHours()} : ${
        date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    } ${date.getHours() >= 12 ? `PM` : `AM`}`;
}
setInterval(currentTimer, 1000);
