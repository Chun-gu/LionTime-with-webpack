import './style.css';
import { StatusBar } from '@components';
import { PAGE } from '@constants';
import { navigate } from '@utils';

StatusBar();

const isLoggedIn = !!sessionStorage.getItem('my-token');

setTimeout(function () {
  if (isLoggedIn) {
    navigate({ to: PAGE.home, replace: true });
  } else {
    navigate({ to: PAGE.login, replace: true });
  }
}, 1500);
