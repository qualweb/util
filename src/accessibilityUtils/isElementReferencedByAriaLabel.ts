function isElementReferencedByAriaLabel(element: typeof window.qwElement): boolean {
  const id = element.getAttribute('id');
  let result = false;
  try {
    if (id !== null) {
      const referencedByAriaLabel = window.qwPage.findAll(`[aria-labelledby~="${id}"]`, element);
      let i = 0;
      while (i < referencedByAriaLabel.length) {
        const ariaLabelBy = referencedByAriaLabel[i].getAttribute('aria-labelledby');
        if (ariaLabelBy !== null) {
          const ids = ariaLabelBy.split(' ');
          if (ids.includes(id)) {
            result = true;
          }
        }
        i++;
      }
    }
  } catch {}
  return result;
}

export default isElementReferencedByAriaLabel;
