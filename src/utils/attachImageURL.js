import { REGEX, IMAGE } from '@constants';

export default function attachImageURL({ src, width, height }) {
  if (REGEX.base64.test(src)) return src;

  const [fullName, filename, extension] = src.match(REGEX.image);
  const url =
    extension === IMAGE.format.gif
      ? IMAGE.externalUrl + fullName
      : `${IMAGE.resizedUrl}${fullName}?w=${width}&h=${height}`;

  return url;
}
