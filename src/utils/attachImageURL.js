import { REGEX, IMAGE } from '@constants';

export default function attachImageURL(src) {
  if (REGEX.base64.test(src)) return src;

  const [filename, extension] = src.match(REGEX.image);
  const url =
    extension === IMAGE.format.gif ? IMAGE.externalUrl : IMAGE.resizedUrl;

  return url + filename;
}
