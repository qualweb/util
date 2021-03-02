'use strict';

import { QWElement } from '@qualweb/qw-element';
import { QWPage } from '@qualweb/qw-page';
import { DomUtils, AccessibilityUtils } from '@qualweb/util';

function isElementFocusable(elementQW: QWElement, pageQW: QWPage): boolean {
  const disabled = elementQW.getElementAttribute('disabled') !== null;

  if (disabled || DomUtils.isElementHiddenByCSS(elementQW, pageQW)) {
    return false;
  } else if (AccessibilityUtils.isElementFocusableByDefault(elementQW, pageQW)) {
    return true;
  } else {
    let tabIndexLessThanZero = false;
    const tabindex = elementQW.getElementAttribute('tabindex');
    const tabIndexExistsAndIsNumber = tabindex !== null && !isNaN(parseInt(tabindex, 10));

    if (tabindex && tabIndexExistsAndIsNumber) {
      tabIndexLessThanZero = parseInt(tabindex, 10) < 0;
    }
    return tabIndexExistsAndIsNumber && !tabIndexLessThanZero;
  }
}

export default isElementFocusable;
