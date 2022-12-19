export default function getFromQueryString(key) {
  const queryString = new URLSearchParams(location.search);
  const value = queryString.get(key) || undefined;

  return value;
}
