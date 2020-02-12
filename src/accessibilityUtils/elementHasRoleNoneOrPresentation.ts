'use strict';

import { ElementHandle } from 'puppeteer';
import getElementAttribute from '../domUtils/getElementAttribute';

async function elementHasRoleNoneOrPresentation(element: ElementHandle): Promise<boolean> {
  let role = await getElementAttribute(element,"role")
  return role!== null && (role === "none" ||role === "presentation");
}

export default elementHasRoleNoneOrPresentation;