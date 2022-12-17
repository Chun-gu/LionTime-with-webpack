export default function hasScroll(element, direction) {
  const DIRECTION = {
    horizontal: 'Width',
    vertical: 'Height',
  };

  const hasScroll =
    element[`scroll${DIRECTION[direction]}`] > element[`client${DIRECTION[direction]}`];

  return hasScroll;
}
