const FOOTER_ACCOUNTNAME = sessionStorage.getItem('my-accountname');

const profileLink = document.querySelector('.link-other-page.profile');
profileLink.addEventListener('click', (e) => {
    e.preventDefault();
    location.href = `profile.html?${FOOTER_ACCOUNTNAME}`;
});
