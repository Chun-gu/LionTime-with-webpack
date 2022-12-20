export default function scrolHorizontal(event, element) {
  const { scrollLeft, clientWidth, scrollWidth } = element;
  // clientWidth <= scrollWidth <= clientWidth + scrollLeft(0~ )
  // 스크롤이 맨 왼쪽일 때,
  if (scrollLeft === 0 && event.deltaY < 0) return false;
  // 스크롤이 맨 오른쪽일 때,
  if (scrollLeft + clientWidth >= scrollWidth && event.deltaY > 0) return false;

  event.preventDefault();

  element.scrollBy({ left: event.deltaY < 0 ? -100 : 100 });
}
