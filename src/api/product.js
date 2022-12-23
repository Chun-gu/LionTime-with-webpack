import api from './config';

import { ResponseError } from '@components';

export async function getProducts({ accountname, LIMIT, skip }) {
  try {
    const response = await api.get(
      `/product/${accountname}?limit=${LIMIT}&skip=${skip}`,
    );

    if (response.product) return { ok: true, products: response.product };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
