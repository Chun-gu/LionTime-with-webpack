import api from './config';

import { ResponseError } from '@components';

export async function getComments({ postId, LIMIT, skip }) {
  try {
    const response = await api.get(
      `/post/${postId}/comments?limit=${LIMIT}&skip=${skip}`,
    );

    if (response.comments) return { ok: true, comments: response.comments };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function postComment(postId, content) {
  try {
    const response = await api.post(`/post/${postId}/comments`, {
      comment: { content },
    });

    if (response.comment) return { ok: true, comment: response.comment };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function deleteComment(postId, commentId) {
  try {
    const response = await api.delete(`/post/${postId}/comments/${commentId}`);

    if (response.status === '200') return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function reportComment(postId, commentId) {
  try {
    const response = await api.post(
      `/post/${postId}/comments/${commentId}/report`,
    );

    if (response.report) return { ok: true };
    else throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
