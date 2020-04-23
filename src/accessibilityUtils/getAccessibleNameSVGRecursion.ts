'use strict';
import { ElementHandle, Page } from 'puppeteer';
import getElementById from '../domUtils/getElementById';
import isElementHidden from '../domUtils/isElementHidden';
import getElementParent from '../domUtils/getElementParent';
import getTrimmedText from './getTrimmedText';
import isElementReferencedByAriaLabel from './isElementReferencedByAriaLabel';
import {
  noAccessibleObjectOrChild, noAccessibleObject, elementsLikeHtml, textContainer
} from './constants';
import getElementTagName from '../domUtils/getElementTagName';
import getElementAttribute from '../domUtils/getElementAttribute';
import getAccessibleName from "./getAccessibleName";
import getElementChildTextContent from "../domUtils/getElementChildTextContent";
import getElementChildren from '../domUtils/getElementChildren';
import getElementStyleProperty from '../domUtils/getElementStyleProperty';


async function getAccessibleNameSVGRecursion(element: ElementHandle, page: Page, recursion: boolean): Promise<string | undefined> {
  let AName, ariaLabelBy, ariaLabel, tag;

  tag = await getElementTagName(element);
  if (!tag)
    tag = '';
  let regex = new RegExp('^fe[a-zA-Z]+');
  ariaLabelBy = await getElementAttribute(element, "aria-labelledby");
  if (ariaLabelBy!== null && await getElementById(page,element,ariaLabelBy) === null) {
    ariaLabelBy = "";
  }
  ariaLabel = await getElementAttribute(element, "aria-label");
  let referencedByAriaLabel = await isElementReferencedByAriaLabel(element, page);
  let title = await getElementChildTextContent(element, "title");
  let titleAtt = await getElementAttribute(element, "xlink:title");//tem de ser a
  let href = await getElementAttribute(element, "href");

  //console.log((DomUtil.isElementHidden(element) && !recursion) +"/"+ hasParentOfName(element,noAccessibleObjectOrChild) +"/"+ (noAccessibleObject.indexOf(tag) >= 0) +"/"+ (noAccessibleObjectOrChild.indexOf(tag) >= 0) +"/"+ regex.test(tag))
  if ((await isElementHidden(element) ||await hasParentOfName(element, noAccessibleObjectOrChild) || noAccessibleObject.indexOf(tag) >= 0 || noAccessibleObjectOrChild.indexOf(tag) >= 0 || regex.test(tag)) && !recursion) {
    //noAName
  } else if (ariaLabelBy && ariaLabelBy !== "" && !(referencedByAriaLabel && recursion)) {
    AName = await getAccessibleNameFromAriaLabelledBy(page,element, ariaLabelBy);
  } else if (elementsLikeHtml.indexOf(tag) >= 0) {
    AName = getAccessibleName(element, page);
  } else if (ariaLabel && ariaLabel.trim() !== "") {
    AName = ariaLabel;
  } else if (title && title.trim() !== "") {
    AName = title;
  } else if (titleAtt && titleAtt.trim() !== "" && tag === "a" && href !== undefined) {//check if link
    AName = titleAtt;
  } else if (textContainer.indexOf(tag)>=0|| recursion) {
    AName = await getTextFromCss(element, page);
  } else if (tag && tag === "text") {
    AName = await getTrimmedText(element);
  }
  return AName;
}


async function hasParentOfName(element: ElementHandle, name: string[]) {

  let parent = await getElementParent(element);
  if (parent) {
    let parentName = await getElementTagName(parent);
    return parentName && name.indexOf(parentName) >= 0 || hasParentOfName(parent, name);
  } else {
    return false;
  }
}


async function getAccessibleNameFromAriaLabelledBy(page: Page, element:ElementHandle,ariaLabelId: string): Promise<string | undefined> {
  let ListIdRefs = ariaLabelId.split(" ");
  let result: string | undefined;
  let accessNameFromId: string | undefined;
  let elem;

  for (let id of ListIdRefs) {
    elem = await getElementById(page,element, id);
    if (elem)
      accessNameFromId = await getAccessibleNameSVGRecursion(elem, page, true);
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




async function getAccessibleNameFromChildren(element: ElementHandle, page: Page): Promise<string[]> {
 
  let aName;
  let children = await getElementChildren(element);
  let elementAnames: string[] = [];

  if (children) {
    for (let child of children) {
      aName = await getAccessibleNameSVGRecursion(child, page, true);
      if (!!aName) {
        elementAnames.push(aName);
      } else {
        elementAnames.push("");
      }
    }
  }
  return elementAnames;
}

async function getTextFromCss(element: ElementHandle, page: Page): Promise<string> {
  let before = await getElementStyleProperty(element, "content", ":before");
  let after = await getElementStyleProperty(element, "content", ":after");
  let aNameList = await getAccessibleNameFromChildren(element, page);
  let textValue = await getConcatentedText(element, aNameList);

  if (after === "none")
    after = "";
  if (before === "none")
    before = "";

  return before.replace(/["']/g, '') + textValue + after.replace(/["']/g, '');
}

async function getConcatentedText(element: ElementHandle, aNames: string[]): Promise<string> {
  if (!element) {
    throw Error('Element is not defined');
  }
  let text = await element.evaluate((element, aNames) => {
    let chidlren = element.childNodes;
    let result = "";
    let textContent;
    let i = 0;
    let counter = 0;
    for (let child of chidlren) {
      textContent = child.textContent
      if (child.nodeType === 3 && !!textContent && textContent.trim() !== "") {
        result = result + (counter === 0 ? "" : " ") + textContent.trim();
        counter++;
      } else if (child.nodeType === 1) {
        result = result + (counter > 0 && !!aNames[i] ? " " : "") + aNames[i];
        i++;
      }

    }
    return result
  }, aNames);

  if (!text) {
    text = "";
  }

  return text;
}

export default getAccessibleNameSVGRecursion;

