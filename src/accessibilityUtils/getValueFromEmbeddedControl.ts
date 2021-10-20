function getValueFromEmbeddedControl(element: typeof window.qwElement): string {
  const role = window.AccessibilityUtils.getElementRoleAName(element, '');
  let name = element.getTagName();
  if (!name) name = '';
  let value = '';

  if (role === 'textbox') {
    const valueAT = element.getAttribute('value');
    value = valueAT ? valueAT : '';
  } else if (role === 'combobox') {
    const refrencedByLabel = element.find(`[aria-activedescendant]`);
    let aria_descendendant, selectedElement, optionSelected;
    if (refrencedByLabel) {
      aria_descendendant = refrencedByLabel.getAttribute('role');
      selectedElement = element.find(`[id="${aria_descendendant}"]`);
    }

    if (name === 'select') {
      optionSelected = element.find(`[selected]`);
    }

    const aria_owns = element.getAttribute('[aria-owns]');
    const elementasToSelect = window.qwPage.find(`[id="${aria_owns}"]`);

    let elementWithAriaSelected;
    if (elementasToSelect) elementWithAriaSelected = elementasToSelect.find(`[aria-selected="true"]`);

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
    let selectedElement;
    let optionSelected;

    for (const elementWithId of elementsWithId) {
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
    const valuenowVar = element.getAttribute('aria-valuenow');
    if (valueTextVar) value = valueTextVar;
    else if (valuenowVar) value = valuenowVar;
  }

  return value;
}

export default getValueFromEmbeddedControl;
