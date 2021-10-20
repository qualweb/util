function getDisabledWidgets(): Array<typeof window.qwElement> {
  const elements = window.qwPage.findAll('*');
  const disabledElements = new Array<typeof window.qwElement>();
  let disable: boolean, ariaDisable: boolean, parent: typeof window.qwElement | null, parentTag: string;
  for (const element of elements) {
    const isWidget = window.AccessibilityUtils.isElementWidget(element);
    disable = element.getAttribute('disabled') !== null;
    ariaDisable = element.getAttribute('aria-disabled') !== null;
    parent = element.getParent();
    if (parent && !(disable || ariaDisable)) {
      parentTag = parent.getTagName();
      if (parentTag === 'label') {
        parent = parent.getParent();
        if (parent) {
          disable = parent.getAttribute('disabled') !== null;
          ariaDisable = parent.getAttribute('aria-disabled') !== null;
        }
      }
    }
    if (isWidget && (disable || ariaDisable)) {
      disabledElements.push(element);
    }
  }
  return disabledElements;
}

export default getDisabledWidgets;
