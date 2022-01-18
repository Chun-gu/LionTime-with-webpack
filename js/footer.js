const profileLink = document.querySelector('.link-profile');
profileLink.addEventListener('click', () => {
    const userId = '데이터';
    location.href = `../pages/profileFollowers.html?${userId}`;
});
