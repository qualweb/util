function isElementFocusable(element: typeof window.qwElement): boolean {
  const disabled = element.getAttribute('disabled') !== null;

  if (disabled || window.DomUtils.isElementHiddenByCSS(element)) {
    return false;
  } else if (window.AccessibilityUtils.isElementFocusableByDefault(element)) {
    return true;
  } else {
    let tabIndexLessThanZero = false;
    const tabindex = element.getAttribute('tabindex');
    const tabIndexExistsAndIsNumber = tabindex !== null && !isNaN(parseInt(tabindex, 10));

    if (tabindex && tabIndexExistsAndIsNumber) {
      tabIndexLessThanZero = parseInt(tabindex, 10) < 0;
    }
    return tabIndexExistsAndIsNumber && !tabIndexLessThanZero;
  }
}

export default isElementFocusable;
