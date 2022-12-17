const IMAGE_URL = process.env.IMAGE_URL;

export default function trimImageURL(url) {
  const imageURLPattern = new RegExp(IMAGE_URL);
  if (imageURLPattern.test(url)) return url;

  const base64Pattern = /base64/;
  if (base64Pattern.test(url)) return url;

  return IMAGE_URL + url;
}
