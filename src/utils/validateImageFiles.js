import { IMAGE, IMAGE_ERROR } from '@constants';

export default function validateImageFiles(imageFiles) {
  let isValid = true;
  let cause;

  [...imageFiles].forEach((imageFile) => {
    if (imageFile.size > IMAGE.MB(3)) {
      isValid = false;
      cause = IMAGE_ERROR.size;
    }

    if (!IMAGE.allowedTypes.includes(imageFile.type)) {
      isValid = false;
      cause = IMAGE_ERROR.format;
    }
  });

  return { isValid, cause };
}
