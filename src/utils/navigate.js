export default function navigate(url, option = { replace: false }) {
  if (option.replace) location.replace(url);
  else location.assign(url);
}
