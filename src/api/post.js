import api from './config';
import { ResponseError } from '@components';

export async function getFeed(LIMIT, skip) {
  try {
    const response = await api.get(`/post/feed?limit=${LIMIT}&skip=${skip}`);

    if (response.posts) return { ok: true, posts: response.posts };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function getPost(postId) {
  try {
    const response = await api.get(`/post/${postId}`);

    if (response.post) return { ok: true, post: response.post };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function postPost(post) {
  try {
    const response = await api.post('/post', { post });

    if (response.post) return { ok: true, postId: response.post.id };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function updatePost(postId, post) {
  try {
    const response = await api.put(`/post/${postId}`, { post });

    if (response.post) return { ok: true, postId: response.post.id };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function reportPost(postId) {
  try {
    const response = await api.post(`/post/${postId}/report`);

    if (response.report) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function deletePost(postId) {
  try {
    const response = await api.delete(`/post/${postId}`);

    if (response.status === '200') return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function heartPost(postId) {
  try {
    const response = await api.post(`/post/${postId}/heart`);

    if (response.post) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}

export async function unheartPost(postId) {
  try {
    const response = await api.delete(`/post/${postId}/unheart`);

    if (response.post) return { ok: true };
    throw new ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
