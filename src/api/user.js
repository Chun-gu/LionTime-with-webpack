import api from './config';

import { ResponseError } from '@components';

export async function getMyInfo() {
  try {
    const response = await api.get(`/user/myinfo`);

    if (response.user) return { ok: true, user: response.user };
    else throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function checkIsEmailAvailable(email) {
  try {
    const response = await api.post('/user/emailvalid', { user: { email } });

    return { ok: true, message: response.message };
  } catch (error) {
    return { ok: false, error: new ResponseError(error) };
  }
}

export async function checkIsAccountnameAvailable(accountname) {
  try {
    const response = await api.post('/user/accountnamevalid', {
      user: { accountname },
    });

    return { ok: true, message: response.message };
  } catch (error) {
    return { ok: false, error: new ResponseError(error) };
  }
}

export async function register(user) {
  try {
    const response = await api.post('/user', { user });

    if (response.user) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function login(user) {
  try {
    const response = await api.post('/user/login', { user });

    if (response.user) return { ok: true, user: response.user };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
