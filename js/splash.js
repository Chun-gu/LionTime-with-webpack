const isLoggedIn = !!sessionStorage.getItem('my-token');
setTimeout(function () {
    if (isLoggedIn) {
        window.location.href = 'pages/home.html';
    } else {
        window.location.href = 'pages/login.html';
    }
}, 3000);
