function getAriaOwner(element: typeof window.qwElement): typeof window.qwElement | null {
  const id = element.getAttribute('id');
  const ariaOwns = window.qwPage.findAll('[aria-owns]', element);
  let index = 0;
  let ariaOwner: typeof window.qwElement | undefined;
  while (id && index < ariaOwns.length && !!ariaOwns) {
    const ariaElement = ariaOwns[index];
    const ariaOwnsAttribute = ariaElement.getAttribute('aria-owns');
    if (ariaOwnsAttribute) {
      const idArray = ariaOwnsAttribute.split(' ');
      if (idArray.includes(id) && ariaElement.isInTheAccessibilityTree()) {
        ariaOwner = ariaElement;
      }
    }
    index++;
  }
  return ariaOwner ?? null;
}

export default getAriaOwner;
