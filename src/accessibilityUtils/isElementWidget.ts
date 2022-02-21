import { widgetRoles } from './constants';

function isElementWidget(element: typeof window.qwElement): boolean {
  const role = window.AccessibilityUtils.getElementRoleAName(element, '');
  return role !== null && widgetRoles.includes(role);
}

export default isElementWidget;
