export default function replaceToPrevPage(fallback = '/') {
  const prevPage = document.referrer;
  const prevDomain = new URL(prevPage).hostname;
  const currDomain = location.hostname;
  const destination = prevDomain === currDomain ? prevPage : fallback;

  history.replaceState(null, null, destination);
  location.reload();
}
