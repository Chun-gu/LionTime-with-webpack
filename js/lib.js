import { IMAGE_URL } from './key';

export function trimImageURL(url) {
    const URLPattern = new RegExp(IMAGE_URL, 'g');
    if (URLPattern.test(url)) return url;
    return IMAGE_URL + url;
}
