import api from './config';

import { ResponseError } from '@components';

export async function checkIsEmailAvailable(email) {
  try {
    const response = await api.post('/user/emailvalid', { user: { email } });

    return { ok: true, message: response.message };
  } catch (error) {
    return { ok: false, error: new ResponseError(error) };
  }
}
