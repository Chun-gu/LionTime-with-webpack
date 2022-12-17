import { hasScroll } from '@utils';

export default function useScrollFix(element) {
  let isFixed = false;

  function toggleScrollFix() {
    if (isFixed) {
      const scrollY = element.style.top;
      element.style = '';
      window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      isFixed = false;
    } else {
      element.style = `
      width: 100%;
      top: -${window.scrollY}px;
      position: fixed;
      ${hasScroll(element, 'vertical') && 'overflow-y: scroll;'}
      `;
      isFixed = true;
    }
  }

  return toggleScrollFix;
}
