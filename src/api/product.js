import api from './config';

import { ResponseError } from '@components';

// TODO: fetch 응답 시간 n초 이상이면 abort
export async function getProduct(productId) {
  try {
    const response = await api.get(`/product/detail/${productId}`);

    if (response.product) return { ok: true, product: response.product };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

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

export async function postProduct(product) {
  try {
    const response = await api.post('/product', { product });

    if (response.product) return { ok: true, productId: response.product.id };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function deleteProduct(productId) {
  try {
    const response = await api.delete(`/product/${productId}`);

    if (response.status === '200') return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
