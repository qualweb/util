//incomplete
//ignores being a header cell assigned to the closest ancestor of the link in the flat tree that has a semantic role of cell or gridcell;
function getLinkContext(element: typeof window.qwElement): Array<string> {
  const context = new Array<string>();
  const parent = element.getParent();
  const ariaDescribedByATT = element.getAttribute('aria-describedby');
  let ariaDescribedBy = new Array<string>();
  if (ariaDescribedByATT) ariaDescribedBy = ariaDescribedByATT.split(' ');
  if (parent) {
    const role = parent.getRole();
    const inAT = parent.isInTheAccessibilityTree();
    const tagName = parent.getTagName();
    const id = parent.getAttribute('id');
    if (
      inAT &&
      (tagName === 'p' ||
        role === 'cell' ||
        role === 'gridcell' ||
        role === 'listitem' ||
        (id && ariaDescribedBy.includes(id)))
    ) {
      context.push(parent.getSelector());
    }
    getLinkContextAux(parent, ariaDescribedBy, context);
  }
  return context;
}

function getLinkContextAux(
  element: typeof window.qwElement,
  ariaDescribedBy: Array<string>,
  context: Array<string>
): void {
  const parent = element.getParent();
  if (parent) {
    const role = parent.getRole();
    const inAT = parent.isInTheAccessibilityTree(); //isElementInAT(when added html list)
    const tagName = parent.getTagName();
    const id = parent.getAttribute('id');
    if (
      inAT &&
      (tagName === 'p' ||
        role === 'cell' ||
        role === 'gridcell' ||
        role === 'listitem' ||
        (id && ariaDescribedBy.includes(id)))
    ) {
      context.push(parent.getSelector());
    }
    getLinkContextAux(parent, ariaDescribedBy, context);
  }
}

export default getLinkContext;
