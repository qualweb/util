function isElementADescendantOf(element: typeof window.qwElement, names: Array<string>, roles: Array<string>): boolean {
  const parent = element.getParent();

  if (parent !== null) {
    let sameRole = false;
    let sameName = false;
    const parentName = parent.getTagName();
    const parentRole = parent.getRole();

    if (parentName !== null) {
      sameName = names.includes(parentName);
    }
    if (parentRole !== null) {
      sameRole = roles.includes(parentRole);
    }

    if (sameName || sameRole) {
      return true;
    }

    return parent.isDescendantOf(names, roles);
  }

  return false;
}

export default isElementADescendantOf;
