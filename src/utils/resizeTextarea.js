export default function resizeTextarea({ element, threshold }) {
  element.style.height = 'auto';
  const scrollHeight = element.scrollHeight;
  element.style.height = `${scrollHeight}px`;

  if (scrollHeight < threshold) element.style.overflowY = 'hidden';
  if (scrollHeight >= threshold) element.style.overflowY = 'scroll';
}
