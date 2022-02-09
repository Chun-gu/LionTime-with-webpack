const messageSendBtn = document.querySelector('.btn-message-send');
const inputText = document.querySelector('.inp-chat');
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
