import { notDefaultAT, needsToBeInsideDetails, notExposedIfEmpty } from './constants';

function isElementInAccessibilityTree(element: typeof window.qwElement): boolean {
  const childPresentational = element.isChildPresentational();
  const isHidden = element.isHidden();
  const role = element.getRole();

  let result = false;

  if (!isHidden && !childPresentational && role !== 'presentation' && role !== 'none') {
    const name = element.getTagName();
    const notExposedIfEmptyTag = notExposedIfEmpty.includes(name);
    const needsToBeInsideDetailsTag = needsToBeInsideDetails.includes(name);

    if (notDefaultAT.includes(name) || notExposedIfEmptyTag || needsToBeInsideDetailsTag) {
      let specialCondition = false;
      if (notExposedIfEmptyTag) {
        const text = element.getText();
        specialCondition = !!text && text.trim() !== '';
      } else if (needsToBeInsideDetailsTag) {
        const parent = element.getParent();
        specialCondition = !!parent && parent.getTagName() === 'details';
      } else if (name === 'picture') {
        const child = element.find('img');
        specialCondition = !!child;
      }
      const type = element.getType();
      const focusable = element.isFocusable();
      const id = element.getAttribute('id');
      let ariaActiveDescendant = false;
      let ariaControls = false;
      let ariaDescribedBy = false;
      let ariaDetails = false;
      let ariaErrorMessage = false;
      let ariaFlowTo = false;
      let ariaLabelledBy = false;
      let ariaOwns = false;
      if (id !== null) {
        ariaActiveDescendant = window.DomUtils.elementIdIsReferenced(element, id, 'aria-activedescendant');
        ariaControls = window.DomUtils.elementIdIsReferenced(element, id, ' aria-controls');
        ariaDescribedBy = window.DomUtils.elementIdIsReferenced(element, id, ' aria-describedby');
        ariaDetails = window.DomUtils.elementIdIsReferenced(element, id, ' aria-details');
        ariaErrorMessage = window.DomUtils.elementIdIsReferenced(element, id, 'aria-errormessage');
        ariaFlowTo = window.DomUtils.elementIdIsReferenced(element, id, 'aria-flowto');
        ariaLabelledBy = window.DomUtils.elementIdIsReferenced(element, id, 'aria-labelledby');
        ariaOwns = window.DomUtils.elementIdIsReferenced(element, id, 'aria-owns');
      }
      const globalWaiARIA = element.hasGlobalARIAPropertyOrAttribute();
      const validRole = element.hasValidRole();

      result =
        specialCondition ||
        type === 'text' ||
        focusable ||
        ariaActiveDescendant ||
        ariaControls ||
        ariaDescribedBy ||
        ariaDetails ||
        ariaErrorMessage ||
        ariaFlowTo ||
        ariaLabelledBy ||
        ariaOwns ||
        validRole ||
        globalWaiARIA;
    } else {
      //defaultInAT
      result = true;
    }
  }
  return result;
}

export default isElementInAccessibilityTree;
