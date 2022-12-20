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

export async function getImageFileNames(images) {
  const formData = new FormData();

  for (const image of images) {
    if (image instanceof File) formData.append('image', image);
  }

  try {
    const response = await api.post('/image/uploadfiles', formData);

    if (!(response instanceof Array)) throw new ResponseError(response);

    const fileNames = response.map((info) => info.filename);
    const imageFileNames = images
      .map((image) => (image instanceof File ? fileNames.shift() : image))
      .join(',');

    return { ok: true, imageFileNames };
  } catch (error) {
    return { ok: false, error };
  }
}
