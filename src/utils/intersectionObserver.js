export default function intersectionObserver(target) {
  const intersectEvent = new CustomEvent('intersect');

  function handleIntersect(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        target.dispatchEvent(intersectEvent);
      }
    });
  }

  const observer = new IntersectionObserver(handleIntersect);

  return observer;
}
