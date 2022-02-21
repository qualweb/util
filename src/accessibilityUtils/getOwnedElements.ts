//elementQW isInAT
function getOwnedElements(element: typeof window.qwElement): Array<typeof window.qwElement> {
  const children = element.getChildren();
  const result = new Array<typeof window.qwElement>();
  const ariaOwnedElements = getAriaOwnedElements(element);
  result.push(...ariaOwnedElements);
  for (const child of children ?? []) {
    result.push(...getOwnedElementsAux(child, element.getSelector()));
  }
  return result;
}

function getOwnedElementsAux(element: typeof window.qwElement, ownerSelector: string): Array<typeof window.qwElement> {
  const ariaOwner = element.getAriaOwner();
  if (
    element.isInTheAccessibilityTree() &&
    (!ariaOwner || (!!ariaOwner && ariaOwner.getSelector() === ownerSelector))
  ) {
    return [element];
  } else {
    const children = element.getChildren();
    const result = new Array<typeof window.qwElement>();
    for (const child of children ?? []) {
      result.push(...getOwnedElementsAux(child, ownerSelector));
    }
    return result;
  }
}

function getAriaOwnedElements(element: typeof window.qwElement): Array<typeof window.qwElement> {
  const ariaOwns = element.getAttribute('aria-owns');
  const elements = new Array<typeof window.qwElement>();
  if (ariaOwns) {
    const splitted = ariaOwns.split(',');
    for (const id of splitted ?? []) {
      const elem = window.qwPage.getElementById(id);
      if (elem) {
        elements.push(elem);
      }
    }
  }
  return elements;
}

export default getOwnedElements;
