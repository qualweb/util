function isElementFocusableByDefault(element: typeof window.qwElement): boolean {
  const draggableAttribute = element.getAttribute('draggable');

  if (draggableAttribute && draggableAttribute === 'true') {
    return true;
  } else {
    const elementName = element.getTagName();
    const hasHref = element.hasAttribute('href');
    const elementAttributeType = element.getAttribute('type');

    const parent = element.getParent();
    let parentName = '';
    let parentChildren = new Array<typeof window.qwElement>();

    if (parent) {
      parentName = parent.getTagName();
      parentChildren = parent.getChildren();
    }

    switch (elementName) {
      case 'a':
      case 'area':
      case 'link':
        if (hasHref) {
          return true;
        }
        break;
      case 'input':
        return !(elementAttributeType && elementAttributeType === 'hidden');
      case 'summary':
        return !!(
          parent &&
          parentName === 'details' &&
          parentChildren &&
          element.getSelector() === parentChildren[0].getSelector()
        );
      case 'textarea':
      case 'select':
      case 'button':
      case 'iframe':
        return true;
    }
    return false;
  }
}

export default isElementFocusableByDefault;
