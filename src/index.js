import './style.css';
import { StatusBar } from '@components';
import { navigate } from '@utils';

StatusBar();

const isLoggedIn = !!sessionStorage.getItem('my-token');

setTimeout(function () {
  if (isLoggedIn) {
    navigate({ to: 'pages/home', replace: true });
  } else {
    navigate({ to: 'pages/login', replace: true });
  }
}, 1500);
