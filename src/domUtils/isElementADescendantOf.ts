'use strict';

import { ElementHandle, Page } from 'puppeteer';
import getElementParent from './getElementParent';
import getElementName from './getElementName';
import getElementRole from '../accessibilityTreeUtils/getElementRole';

async function isElementADescendantOf(element: ElementHandle, page: Page, names: string [], roles: string[]): Promise<boolean> {
  if (!element) {
    throw Error('Element is not defined');
  }
  let parent = await getElementParent(element);
  let result = false;
  let sameRole, sameName;

  if (parent !== null) {
    let parentName = await getElementName(parent);
    let parentRole = await getElementRole(parent, page);


    if (parentName !== null) {
      sameName = names.includes(parentName);
    }
    if (parentRole !== null) {
      sameRole = roles.includes(parentRole);
    }
    result = sameName || sameRole;
    if (!result) {
      return await isElementADescendantOf(parent, page, names, roles);
    } else {
      return result;
    }
  } else {
    return result;
  }
}

export = isElementADescendantOf;