const linkImgBtn = document.querySelectorAll('.link-img');
const backKeyBtn = document.querySelector('.btn-back-key');
const currentTime = document.querySelector('.text-current-time');
linkImgBtn.forEach((selectBtn) => {
    selectBtn.addEventListener('click', () => {
        selectBtn.classList.add('this-page');
        linkImgBtn.forEach((btn) => {
            if (btn !== selectBtn) {
                btn.classList.remove('this-page');
            }
        });
    });
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
