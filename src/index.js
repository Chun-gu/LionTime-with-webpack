import './style.css';
import { StatusBar } from '@components';
import { PAGE } from '@constants';
import { navigate } from '@utils';

StatusBar();

const isLoggedIn = !!sessionStorage.getItem('my-token');

setTimeout(function () {
  if (isLoggedIn) {
    navigate({ to: `pages/${PAGE.home}`, replace: true });
  } else {
    navigate({ to: `pages/${PAGE.login}`, replace: true });
  }
}, 1500);
