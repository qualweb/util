import roles from './elementImplicitRoles.json';

function getImplicitRole(element: typeof window.qwElement, accessibleName: string | undefined): string | null {
  const name = element.getTagName();
  let attributes, role;
  if (name) {
    const roleValues = roles[name.toLocaleLowerCase()];
    if (roleValues !== undefined) {
      for (const roleValue of roleValues) {
        const special = roleValue['special'];
        attributes = roleValue['attributes'];
        if (attributes.length === 0 || isInList(attributes, element)) {
          if (!special) {
            role = roleValue['role'];
          } else {
            const heading = new RegExp('h[1-6]');
            if (name === 'footer' || name === 'header') {
              role = getRoleHeaderFooter(element, roleValue);
            } else if (name === 'form' || name === 'section') {
              if (accessibleName !== undefined) {
                role = roleValue['role'];
              }
            } else if (heading.test(name)) {
              role = getRoleHeading(element, roleValue);
            } else if (name === 'img') {
              role = getRoleImg(element, roleValue);
            } else if (name === 'input') {
              role = getRoleInput(element, roleValue);
            } else if (name === 'li') {
              role = getRoleLi(element, roleValue);
            } else if (name === 'option') {
              role = getRoleOption(element, roleValue);
            } else if (name === 'select') {
              role = getRoleSelect(element, roleValue);
            } else if (name === 'td') {
              if (element.isDescendantOfExplicitRole(['table'], [])) {
                role = roleValue['role'];
              }
            }
          }
        }
      }
    }
  }
  return role;
}

function getRoleHeading(element: typeof window.qwElement, roleValue) {
  const ariaLevel = element.getAttribute('aria-level');
  let role;
  if (ariaLevel === null || parseInt(ariaLevel) > 0) {
    role = roleValue['role'];
  }
  return role;
}

function getRoleSelect(element: typeof window.qwElement, roleValue) {
  const size = element.getAttribute('size');
  const multiple = element.getAttribute('multiple');
  let role;

  if (multiple !== null && size !== null && parseInt(size, 10) > 1) {
    role = 'listbox';
  } else {
    role = roleValue['role'];
  }
  return role;
}

function getRoleHeaderFooter(element: typeof window.qwElement, roleValue) {
  let role;
  if (
    element.isDescendantOfExplicitRole(
      ['article', 'aside', 'main', 'nav', 'section'],
      ['article', 'complementary', 'main', 'navigation', 'region']
    )
  ) {
    role = roleValue['role'];
  }

  return role;
}

function getRoleInput(element: typeof window.qwElement, roleValue) {
  const list = element.getAttribute('list');
  const type = element.getAttribute('type');
  let role;

  if (list !== null) {
    role = roleValue['role'];
  } else if (type === 'search') {
    role = 'searchbox';
  } else {
    role = 'textbox';
  }
  return role;
}

function getRoleOption(element: typeof window.qwElement, roleValue) {
  const parent = element.getParent();
  let parentName;
  let role;
  if (parent !== null) parentName = parent.getTagName();

  if (parentName === 'datalist') {
    role = roleValue['role'];
  }
  return role;
}

function getRoleImg(element: typeof window.qwElement, roleValue) {
  const alt = element.getAttribute('alt');
  let role;
  if (alt !== '') {
    role = roleValue['role'];
  } else if (element.hasAttribute('alt') && !(element.isFocusable() || element.hasGlobalARIAPropertyOrAttribute())) {
    role = 'presentation';
  }
  return role;
}

function getRoleLi(element: typeof window.qwElement, roleValue) {
  const parent = element.getParent();
  let role;
  const parentNames = ['ol', 'ul', 'menu'];
  let parentName;
  if (parent !== null) parentName = parent.getTagName();

  if (parentName !== null && parentNames.includes(parentName)) {
    role = roleValue['role'];
  }
  return role;
}

function isInList(attributes, element: typeof window.qwElement) {
  let result;
  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    const key = attribute[0];
    const value = attribute[1];
    const roleSpecificATT = element.getAttribute(key);
    if (roleSpecificATT === value || (value === '' && roleSpecificATT !== null)) result = true;
  }
  return result;
}

export default getImplicitRole;
