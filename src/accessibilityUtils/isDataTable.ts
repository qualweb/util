function isDataTable(element: typeof window.qwElement): boolean {
  // based on https://www.w3.org/TR/WCAG20-TECHS/H43.html
  // and https://fae.disability.illinois.edu/rulesets/TABLE_5/
  // it is considered that AccessibilityUtils element is already a <table> element
  const accessibleName = element.getAccessibleName();
  const thElem = element.findAll('th');
  const tdHeaders = element.findAll('td[scope]');
  const tdWithHeaders = element.findAll('td[headers]');
  const presentation = element.getAttribute('role') === 'presentation';
  const describedBy = Boolean(element.getAttribute('aria-describedby'));

  return presentation
    ? false
    : !!accessibleName || thElem.length > 0 || tdHeaders.length > 0 || tdWithHeaders.length > 0 || describedBy;
}

export default isDataTable;
