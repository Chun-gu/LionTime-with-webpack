import { IMAGE_URL } from './key.js';

// IMAGE_URL이 없으면 붙여주고, 중복되면 중복 제거
export function trimImageURL(url) {
    const URLPattern = new RegExp(
        `(${IMAGE_URL.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})+`
    );
    if (URLPattern.test(url)) return url.replace(URLPattern, IMAGE_URL);
    return IMAGE_URL + url;
}

// 디바운스
export function debounce(func, timeout) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

// queryString에서 원하는 값 가져오기
export function getFromQueryString(key) {
    const queryString = new URLSearchParams(location.search);
    const value = queryString.get(key);

    return value;
}
