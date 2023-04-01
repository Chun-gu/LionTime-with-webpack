import { IMAGE, REGEX } from '@constants';

export default function Image({ src, alt, shouldLazy = false, fallback }) {
  const img = document.createElement('img');
  const [filename, extension] = src.match(REGEX.image);
  const url =
    extension === IMAGE.format.gif ? IMAGE.externalUrl : IMAGE.resizedUrl;

  img.src = url + filename;
  img.alt = alt;
  if (shouldLazy) img.setAttribute('loading', 'lazy');
  img.onerror = ({ target }) => {
    target.onerror = null;
    target.src = fallback;
  };

  return img;
}
