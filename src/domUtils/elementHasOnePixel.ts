function elementHasOnePixel(element: typeof window.qwElement): boolean {
  const height = element.getComputedStyle('height', '');
  const background = element.getComputedStyle('background-color', '');
  const parent = element.getParent();
  let parentBackGround: string | undefined;
  if (parent) {
    parentBackGround = element.getComputedStyle('background-color', '');
  }
  return (
    !!height && height.replace(' ', '') === '1px' && (parentBackGround === background || background === 'transparent')
  );
}

export default elementHasOnePixel;
