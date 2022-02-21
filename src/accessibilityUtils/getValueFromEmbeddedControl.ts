function getValueFromEmbeddedControl(element: typeof window.qwElement): string {
  const role = window.AccessibilityUtils.getElementRoleAName(element, '');
  const name = element.getTagName();
  let value = '';

  if (role === 'textbox') {
    const valueAT = element.getAttribute('value');
    value = valueAT ?? '';
  } else if (role === 'combobox') {
    const referencedByLabel = element.find(`[aria-activedescendant]`);
    let aria_descendant: string | null;
    let selectedElement: typeof window.qwElement | null = null;
    let optionSelected: typeof window.qwElement | null = null;

    if (referencedByLabel) {
      aria_descendant = referencedByLabel.getAttribute('role');
      selectedElement = element.find(`[id="${aria_descendant}"]`);
    }

    if (name === 'select') {
      optionSelected = element.find(`[selected]`);
    }

    const aria_owns = element.getAttribute('[aria-owns]');
    const elementsToSelect = window.qwPage.find(`[id="${aria_owns}"]`);

    let elementWithAriaSelected: typeof window.qwElement | null = null;
    if (elementsToSelect) {
      elementWithAriaSelected = elementsToSelect.find(`[aria-selected="true"]`);
    }

    if (optionSelected) {
      value = optionSelected.getText() ?? '';
    } else if (selectedElement) {
      value = selectedElement[0] ?? '';
    } else if (elementWithAriaSelected) {
      value = elementWithAriaSelected[0] ?? '';
    }
  } else if (role === 'listbox') {
    const elementsWithId = element.findAll(`[id]`);
    const elementWithAriaSelected = element.find(`[aria-selected="true"]`);
    let selectedElement: typeof window.qwElement | null = null;
    let optionSelected: typeof window.qwElement | null = null;

    for (const elementWithId of elementsWithId ?? []) {
      if (selectedElement) {
        const id = elementWithId.getAttribute('id');
        selectedElement = element.find(`[aria-activedescendant="${id}"]`);
      }
    }

    if (name === 'select') {
      optionSelected = element.find(`[selected]`);
    }

    if (selectedElement) value = elementsWithId[0].getText() ?? '';
    else if (elementWithAriaSelected) {
      value = elementWithAriaSelected.getText() ?? '';
    } else if (optionSelected) {
      value = optionSelected.getText() ?? '';
    }
  } else if (
    role === 'range' ||
    role === 'progressbar' ||
    role === 'scrollbar' ||
    role === 'slider' ||
    role === 'spinbutton'
  ) {
    const valueTextVar = element.getAttribute('aria-valuetext');
    const valueNowVar = element.getAttribute('aria-valuenow');

    if (valueTextVar) {
      value = valueTextVar;
    } else if (valueNowVar) {
      value = valueNowVar;
    }
  }

  return value;
}

export default getValueFromEmbeddedControl;
