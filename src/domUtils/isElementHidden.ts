function isElementHidden(element: typeof window.qwElement): boolean {
  const name = element.getTagName();
  const type = element.getAttribute('type');
  const typeHidden = name === 'input' && type === 'hidden';
  const ariaHidden = element.getAttribute('aria-hidden') === 'true';
  const hidden = element.getAttribute('hidden') !== null;
  const cssHidden = window.DomUtils.isElementHiddenByCSSAux(element);
  const parent = element.getParent();

  let parentHidden = false;
  if (parent) {
    parentHidden = parent.isHidden();
  }

  return cssHidden || hidden || ariaHidden || parentHidden || typeHidden;
}

export default isElementHidden;
