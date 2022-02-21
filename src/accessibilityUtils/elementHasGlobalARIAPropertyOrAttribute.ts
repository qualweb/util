import ariaJSON from './ariaAttributesRoles.json';

function elementHasGlobalARIAPropertyOrAttribute(element: typeof window.qwElement): boolean {
  let elemAttribs = element.getAttributeNames();
  elemAttribs = elemAttribs.filter((elem) => elem.startsWith('aria'));
  let result = false;
  let i = 0;
  //TODO: perceber melhor
  while (!result && i < elemAttribs.length) {
    result = elemAttribs[i] in ariaJSON && ariaJSON[elemAttribs[i]].global;
    i++;
  }
  return result;
}

export default elementHasGlobalARIAPropertyOrAttribute;
