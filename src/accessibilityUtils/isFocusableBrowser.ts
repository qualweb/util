function isFocusableBrowser(element: typeof window.qwElement): boolean {
  element.focusElement();
  const focused = window.qwPage.getFocusedElement();
  return element.getSelector() === focused?.getSelector();
}

export default isFocusableBrowser;
