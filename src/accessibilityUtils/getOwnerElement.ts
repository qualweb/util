function getOwnerElement(element: typeof window.qwElement): typeof window.qwElement | null {
  const ariaOwner = window.AccessibilityUtils.getAriaOwner(element);
  let ownerElement;

  if (ariaOwner) {
    ownerElement = ariaOwner;
  } else {
    let parent = element.getParent();
    while (!!parent && !ownerElement) {
      if (window.AccessibilityUtils.isElementInAT(parent)) ownerElement = parent;
      parent = parent.getParent();
    }
  }
  return ownerElement || null;
}

export default getOwnerElement;
