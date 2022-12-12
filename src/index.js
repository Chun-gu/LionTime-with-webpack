import './style.css';
import { StatusBar } from '@components';

StatusBar();

const isLoggedIn = !!sessionStorage.getItem('my-token');

setTimeout(function () {
  if (isLoggedIn) {
    window.location.href = 'pages/home';
  } else {
    window.location.href = 'pages/login';
  }
}, 1500);
