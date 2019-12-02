'use strict';

import {
  ElementHandle
} from 'puppeteer';

async function getElementChildTextContent(element: ElementHandle, childName: string): Promise<string | undefined> {
  if (!element) {
    throw Error('Element is not defined');
  }

  return element.evaluate((elem, childName) => {
    for (const child of elem.children) {
      if (child.tagName.toLowerCase() === childName.toLowerCase()) {
        return child['text'];
      }
    }
  }, childName);
}

export = getElementChildTextContent;