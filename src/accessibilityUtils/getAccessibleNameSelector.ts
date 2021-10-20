import { formElements, typesWithLabel } from './constants';

function getAccessibleNameSelector(element: typeof window.qwElement): Array<string> | undefined {
  return getAccessibleNameRecursion(element, false, false);
}

function getAccessibleNameRecursion(
  element: typeof window.qwElement,
  recursion: boolean,
  isWidget: boolean
): string[] | undefined {
  let AName, ariaLabelBy;
  const elementSelector = element.getSelector();
  const name = element.getTagName();
  const allowNameFromContent = window.AccessibilityUtils.allowsNameFromContent(element);
  ariaLabelBy = element.getAttribute('aria-labelledby');

  if (ariaLabelBy !== null && !verifyAriaLabel(ariaLabelBy)) {
    ariaLabelBy = '';
  }
  const ariaLabel = element.getAttribute('aria-label') ? [elementSelector] : null;
  const attrType = element.getAttribute('type');
  const title = element.getAttribute('title') ? [elementSelector] : null;
  const alt = element.getAttribute('alt') ? [elementSelector] : null;
  const value = element.getAttribute('value') ? [elementSelector] : null;
  const placeholder = element.getAttribute('placeholder') ? [elementSelector] : null;
  const role = window.AccessibilityUtils.getElementRoleAName(element, '');
  const id = element.getAttribute('id');
  const defaultName = window.AccessibilityUtils.getDefaultName(element) ? ['default'] : null;

  const referencedByAriaLabel = window.AccessibilityUtils.isElementReferencedByAriaLabel(element);
  if (ariaLabelBy && ariaLabelBy !== '' && !(referencedByAriaLabel && recursion)) {
    AName = getAccessibleNameFromAriaLabelledBy(element, ariaLabelBy);
  } else if (ariaLabel) {
    AName = ariaLabel;
  } else if (isWidget && window.AccessibilityUtils.isElementControl(element)) {
    const valueFromEmbeddedControl = window.AccessibilityUtils.getValueFromEmbeddedControl(element)
      ? elementSelector
      : null;
    AName = getFirstNotUndefined(valueFromEmbeddedControl, title);
  } else if (name === 'area' || (name === 'input' && attrType === 'image')) {
    AName = getFirstNotUndefined(alt, title);
  } else if (name === 'img') {
    AName = getFirstNotUndefined(alt, title);
  } else if (name === 'input' && (attrType === 'button' || attrType === 'submit' || attrType === 'reset')) {
    AName = getFirstNotUndefined(value, defaultName, title);
  } else if (name === 'input' && (!attrType || typesWithLabel.indexOf(attrType) >= 0)) {
    if (!recursion) {
      AName = getFirstNotUndefined(getValueFromLabel(element, id), title, placeholder);
    } else {
      AName = getFirstNotUndefined(title, placeholder);
    }
  } else if (name && formElements.indexOf(name) >= 0) {
    if (!recursion) {
      AName = getFirstNotUndefined(getValueFromLabel(element, id), title);
    } else {
      AName = getFirstNotUndefined(title);
    }
  } else if (name === 'textarea') {
    if (!recursion) {
      AName = getFirstNotUndefined(getValueFromLabel(element, id), title, placeholder);
    } else {
      AName = getFirstNotUndefined(getTextFromCss(element, isWidget), title, placeholder);
    }
  } else if (name === 'figure') {
    AName = getFirstNotUndefined(...(getValueFromSpecialLabel(element, 'figcaption') || []), title);
  } else if (name === 'table') {
    AName = getFirstNotUndefined(...(getValueFromSpecialLabel(element, 'caption') || []), title);
  } else if (name === 'fieldset') {
    AName = getFirstNotUndefined(...(getValueFromSpecialLabel(element, 'legend') || []), title);
  } else if (allowNameFromContent || (((role && allowNameFromContent) || !role) && recursion)) {
    AName = getFirstNotUndefined(...getTextFromCss(element, isWidget), title);
  } /*if (name && (sectionAndGrouping.indexOf(name) >= 0 || name === "iframe" || tabularElements.indexOf(name) >= 0)) and all other elements*/ else {
    AName = getFirstNotUndefined(title);
  }

  return AName;
}

function getFirstNotUndefined(...args: any[]): string | undefined {
  let result;
  let i = 0;
  let arg;
  let end = false;

  while (i < args.length && !end) {
    arg = args[i];
    if (arg !== undefined && arg !== null) {
      result = arg;
      if (String(arg).trim() !== '') {
        end = true;
      }
    }
    i++;
  }

  return result;
}

function getValueFromSpecialLabel(element: typeof window.qwElement, label: string): Array<string> | undefined {
  const labelElement = element.find(label);
  let accessNameFromLabel, result;

  if (labelElement) accessNameFromLabel = getAccessibleNameRecursion(labelElement, true, false);

  if (accessNameFromLabel) result = [element.getSelector()];

  return result;
}

function getValueFromLabel(element: typeof window.qwElement, id: string | null): Array<string> {
  const referencedByLabelList = new Array<typeof window.qwElement>();
  const referencedByLabel = window.qwPage.findAll(`label[for="${id}"]`, element);
  if (referencedByLabel) {
    referencedByLabelList.push(...referencedByLabel);
  }
  const parent = element.getParent();
  const isWidget = window.AccessibilityUtils.isElementWidget(element);

  if (parent && parent.getTagName() === 'label' && !isElementPresent(parent, referencedByLabelList)) {
    referencedByLabelList.push(parent);
  }

  const result = new Array<string>();
  for (const label of referencedByLabelList) {
    const accessNameFromLabel = getAccessibleNameRecursion(label, true, isWidget);
    if (accessNameFromLabel) {
      result.push(label.getSelector());
    }
  }

  return result;
}
function isElementPresent(element: typeof window.qwElement, listElement: Array<typeof window.qwElement>): boolean {
  let result = false;
  let i = 0;
  const elementSelector = element.getSelector();
  while (i < listElement.length && !result) {
    result = elementSelector === listElement[i].getSelector();
    i++;
  }
  return result;
}

function getAccessibleNameFromAriaLabelledBy(element: typeof window.qwElement, ariaLabelId: string): Array<string> {
  const ListIdRefs = ariaLabelId.split(' ');
  const result = new Array<string>();
  let accessNameFromId;
  const isWidget = window.AccessibilityUtils.isElementWidget(element);
  const elementID = element.getAttribute('id');

  for (const id of ListIdRefs || []) {
    if (id !== '' && elementID !== id) {
      const elem = window.qwPage.getElementById(id);
      if (elem) {
        accessNameFromId = getAccessibleNameRecursion(elem, true, isWidget);
        if (accessNameFromId) {
          result.push(elem.getSelector());
        }
      }
    }
  }
  return result;
}

function getTextFromCss(element: typeof window.qwElement, isWidget: boolean): Array<string> {
  const aNameList = getAccessibleNameFromChildren(element, isWidget);
  const textValue = getConcatenatedText(element, []) ? element.getSelector() : null;

  if (textValue) aNameList.push(textValue);

  return aNameList;
}

function getConcatenatedText(element: typeof window.qwElement, aNames: Array<string>): string {
  return element.concatAccessibleNames(aNames);
}

function getAccessibleNameFromChildren(element: typeof window.qwElement, isWidget: boolean): Array<string> {
  if (!isWidget) {
    isWidget = window.AccessibilityUtils.isElementWidget(element);
  }
  const children = element.getChildren();
  const result = new Array<string>();
  let aName;

  if (children) {
    for (const child of children) {
      aName = getAccessibleNameRecursion(child, true, isWidget);
      if (aName) {
        result.push(child.getSelector());
      }
    }
  }
  return result;
}

function verifyAriaLabel(ariaLabelBy: string): boolean {
  const elementIds = ariaLabelBy.split(' ');
  let result = false;
  for (const id of elementIds) {
    if (!result) {
      result = window.qwPage.getElementById(id) !== null;
    }
  }

  return result;
}

export default getAccessibleNameSelector;
