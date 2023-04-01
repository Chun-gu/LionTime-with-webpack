import { attachImageURL } from '@utils';

export default function Image({ src, alt, shouldLazy = false, fallback }) {
  const img = document.createElement('img');

  img.src = attachImageURL(src);
  img.alt = alt;
  if (shouldLazy) img.setAttribute('loading', 'lazy');
  img.onerror = ({ target }) => {
    target.onerror = null;
    target.src = fallback;
  };

  return img;
}
