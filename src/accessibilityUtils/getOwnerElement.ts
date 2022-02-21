function getOwnerElement(element: typeof window.qwElement): typeof window.qwElement | null {
  const ariaOwner = element.getAriaOwner();
  let ownerElement: typeof window.qwElement | null = null;

  if (ariaOwner) {
    ownerElement = ariaOwner;
  } else {
    let parent = element.getParent();
    while (parent && !ownerElement) {
      if (parent.isInTheAccessibilityTree()) {
        ownerElement = parent;
      }
      parent = parent.getParent();
    }
  }
  return ownerElement;
}

export default getOwnerElement;
