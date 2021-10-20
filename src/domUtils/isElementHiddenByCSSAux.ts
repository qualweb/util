function isElementHiddenByCSSAux(element: typeof window.qwElement): boolean {
  const display = element.getComputedStyle('display', '');
  const displayNone = display ? display.trim() === 'none' : false;
  const visibilityATT = element.getComputedStyle('visibility', '');
  const visibility = visibilityATT ? visibilityATT.trim() === 'collapse' || visibilityATT.trim() === 'hidden' : false;

  return visibility || displayNone;
}

export default isElementHiddenByCSSAux;
