export default function saveCurrentPageURL() {
  sessionStorage.setItem('prevPageURL', window.location.href);
}
