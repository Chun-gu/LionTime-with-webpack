import api from './config';

export async function getImageFileName(image) {
  const formData = new FormData();
  formData.append('image', image);

  try {
    const response = await api.post('/image/uploadfile', formData);

    if (response.filename) return { ok: true, filename: response.filename };
    throw ResponseError(response);
  } catch (error) {
    return { ok: false, error };
  }
}
