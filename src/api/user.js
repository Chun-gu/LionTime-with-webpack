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

export async function searchUser(keyword) {
  try {
    const response = await api.get(`/user/searchuser/?keyword=${keyword}`);

    if (response instanceof Array) return { ok: true, users: response };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function getProfile(accountname) {
  try {
    const response = await api.get(`/profile/${accountname}`);

    if (response.profile) return { ok: true, profile: response.profile };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function modifyProfile(user) {
  try {
    const response = await api.put('/user', { user });

    if (response.user) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function getFollowStatus({ accountname, page, LIMIT, skip }) {
  try {
    const response = await api.get(
      `/profile/${accountname}/${page}?limit=${LIMIT}&skip=${skip}`,
    );

    if (response instanceof Array) return { ok: true, users: response };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function follow(accountname) {
  try {
    const response = await api.post(`/profile/${accountname}/follow`);

    if (response.profile) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function unfollow(accountname) {
  try {
    const response = await api.delete(`/profile/${accountname}/unfollow`);

    if (response.profile) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
