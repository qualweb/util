function isPartOfSequentialFocusNavigation(element: typeof window.qwElement): boolean {
  let tabIndexLessThanZero = false;
  const tabindex = element.getAttribute('tabindex');
  const tabIndexExistsAndIsNumber = tabindex !== null && !isNaN(parseInt(tabindex, 10));

  if (tabindex && tabIndexExistsAndIsNumber) {
    tabIndexLessThanZero = parseInt(tabindex, 10) < 0;
  }
  const focusable = element.isFocusable();
  return (focusable && tabIndexExistsAndIsNumber && !tabIndexLessThanZero) || (focusable && !tabIndexExistsAndIsNumber);
}

export default isPartOfSequentialFocusNavigation;
