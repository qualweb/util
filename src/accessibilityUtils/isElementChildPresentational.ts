import isElementChildPresentationalAux from './isElementChildPresentationalAux';

function isElementChildPresentational(element: typeof window.qwElement): boolean {
  const focusable = element.isFocusable();
  const hasGlobalARIA = element.hasGlobalARIAPropertyOrAttribute();
  const parent = element.getParent();
  let childPresentational = false;

  if (parent && !focusable && !hasGlobalARIA) {
    childPresentational = isElementChildPresentationalAux(parent);
  }

  return !focusable && !hasGlobalARIA && childPresentational;
}

export default isElementChildPresentational;
