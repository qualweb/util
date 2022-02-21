function getElementRoleAName(element: typeof window.qwElement, aName: string | undefined): string | null {
  const explicitRole = element.getAttribute('role');

  let role = explicitRole;
  if (
    explicitRole === null ||
    ((explicitRole === 'none' || explicitRole === 'presentation') &&
      (element.isFocusable() || element.hasGlobalARIAPropertyOrAttribute()))
  ) {
    role = element.getImplicitRole(aName);
  }

  return role;
}

export = getElementRoleAName;
