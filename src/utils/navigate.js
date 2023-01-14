export default function navigate({ to = '', goBack = false, replace = false }) {
  let destination = to;

  if (goBack) {
    const referrer = document.referrer;
    const prevPageURL = sessionStorage.getItem('prevPageURL');
    destination = referrer || prevPageURL || '/';
  }

  if (replace) location.replace(destination);
  else location.assign(destination);
}
