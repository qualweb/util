function getElementRoleAName(element: typeof window.qwElement, aName: string | undefined): string | null {
  console.log('element:', element);
  const explicitRole = element.getAttribute('role');
  console.log('explicitRole:', explicitRole);
  let role = explicitRole;
  if (
    explicitRole === null ||
    ((explicitRole === 'none' || explicitRole === 'presentation') &&
      (window.AccessibilityUtils.isElementFocusable(element) ||
        window.AccessibilityUtils.elementHasGlobalARIAPropertyOrAttribute(element)))
  ) {
    role = window.AccessibilityUtils.getImplicitRole(element, aName);
  }
  console.log('role: ', role);
  return role;
}

export = getElementRoleAName;
