import { noAccessibleObjectOrChild, noAccessibleObject, elementsLikeHtml, textContainer } from './constants';
import isElementReferencedByAriaLabel from './isElementReferencedByAriaLabel';

function getAccessibleNameSVGRecursion(element: typeof window.qwElement, recursion: boolean): string | undefined {
  let AName, ariaLabelBy, tag;

  tag = element.getTagName();
  if (!tag) tag = '';
  const regex = new RegExp('^fe[a-zA-Z]+');
  ariaLabelBy = element.getAttribute('aria-labelledby');
  if (ariaLabelBy !== null && window.qwPage.getElementById(ariaLabelBy) === null) {
    ariaLabelBy = '';
  }
  const ariaLabel = element.getAttribute('aria-label');
  const referencedByAriaLabel = isElementReferencedByAriaLabel(element);
  const title = element.getChildTextContent('title');
  const titleAtt = element.getAttribute('xlink:title'); //tem de ser a
  const href = element.getAttribute('href');
  const roleLink = tag === 'a' && href !== undefined;

  //console.log((DomUtil.isElementHidden(element) && !recursion) +"/"+ hasParentOfName(element,noAccessibleObjectOrChild) +"/"+ (noAccessibleObject.indexOf(tag) >= 0) +"/"+ (noAccessibleObjectOrChild.indexOf(tag) >= 0) +"/"+ regex.test(tag))
  if (
    (element.isHidden() ||
      hasParentOfName(element, noAccessibleObjectOrChild) ||
      noAccessibleObject.indexOf(tag) >= 0 ||
      noAccessibleObjectOrChild.indexOf(tag) >= 0 ||
      regex.test(tag)) &&
    !recursion
  ) {
    //noAName
  } else if (ariaLabelBy && ariaLabelBy !== '' && !(referencedByAriaLabel && recursion)) {
    AName = getAccessibleNameFromAriaLabelledBy(element, ariaLabelBy);
  } else if (elementsLikeHtml.indexOf(tag) >= 0) {
    AName = element.getAccessibleName();
  } else if (ariaLabel && ariaLabel.trim() !== '') {
    AName = ariaLabel;
  } else if (title && title.trim() !== '') {
    AName = title;
  } else if (titleAtt && titleAtt.trim() !== '' && roleLink) {
    //check if link
    AName = titleAtt;
  } else if (roleLink) {
    AName = getTextFromCss(element);
  } else if (tag && tag === 'text') {
    AName = element.getText()?.trim();
  }
  return AName;
}

function hasParentOfName(element: typeof window.qwElement, name: Array<string>): boolean {
  const parent = element.getParent();
  if (parent) {
    const parentName = parent.getTagName();
    return (parentName && name.indexOf(parentName) >= 0) || hasParentOfName(parent, name);
  } else {
    return false;
  }
}

function getAccessibleNameFromAriaLabelledBy(
  element: typeof window.qwElement,
  ariaLabelId: string
): string | undefined {
  const ListIdRefs = ariaLabelId.split(' ');
  let result: string | undefined;
  let accessNameFromId: string | undefined;
  let elem;
  const elementID = element.getAttribute('id');

  for (const id of ListIdRefs) {
    if (id !== '' && elementID !== id) elem = window.qwPage.getElementById(id);
    if (elem) accessNameFromId = getAccessibleNameSVGRecursion(elem, true);
    if (accessNameFromId) {
      if (result) {
        result += accessNameFromId;
      } else {
        result = accessNameFromId;
      }
    }
  }

  return result;
}

function getAccessibleNameFromChildren(element: typeof window.qwElement): Array<string> {
  let aName;
  const children = element.getChildren();
  const elementAnames = new Array<string>();
  if (children) {
    for (const child of children) {
      const name = child.getTagName();
      if (textContainer.indexOf(name) >= 0) {
        aName = getAccessibleNameSVGRecursion(child, true);
        if (aName) {
          elementAnames.push(aName);
        } else {
          elementAnames.push('');
        }
      }
    }
  }
  return elementAnames;
}

function getTextFromCss(element: typeof window.qwElement): string {
  let before = element.getComputedStyle('content', ':before');
  let after = element.getComputedStyle('content', ':after');
  const aNameList = getAccessibleNameFromChildren(element);
  const textValue = getConcatenatedText(aNameList);

  if (after === 'none') after = '';
  if (before === 'none') before = '';

  return before.replace(/["']/g, '') + textValue + after.replace(/["']/g, '');
}

function getConcatenatedText(aNames: Array<string>): string {
  let result = '';
  for (const aName of aNames) {
    result += aName;
  }
  return result;
}

export default getAccessibleNameSVGRecursion;
