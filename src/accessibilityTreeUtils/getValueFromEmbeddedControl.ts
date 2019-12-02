'use strict';
import getElementAttribute = require("../domUtils/getElementAttribute");
import getTrimmedText = require("./getTrimmedText");
import { ElementHandle, Page } from "puppeteer";
import { getElementName } from "../domUtils/domUtils";

async function getValueFromEmbeddedControl(element: ElementHandle, page:Page): Promise<string> {//stew

  let role = await getElementAttribute(element, "role");
  let name = await getElementName(element);
  let value = "";
  let text = await getTrimmedText(element);


  if ((role === "textbox") && text) {
    value = text;
  } else if (role === "combobox") {
    let refrencedByLabel = await element.$(`[aria-activedescendant]`);
    let aria_descendendant, selectedElement;
    if (refrencedByLabel !== null) {
      aria_descendendant = await getElementAttribute(refrencedByLabel, "role");
      selectedElement = await element.$(`[id="${aria_descendendant}"]`);
    }

    let aria_owns = await getElementAttribute(element, "aria-owns");
    let elementasToSelect = await page.$(`[id="${aria_owns}"]`);

    let elementWithAriaSelected;
    if (elementasToSelect !== null)
      elementWithAriaSelected = elementasToSelect.$(`aria-selected="true"`);


    if (selectedElement.length > 0) {
      value = await getTrimmedText(selectedElement[0]);
    } else if (elementWithAriaSelected.length > 0) {
      value = await getTrimmedText(elementWithAriaSelected[0]);
    }

  } else if (role === "listbox" || name === 'select') {
    let elementsWithId =await element.$$(`[id]`);
    let elementWithAriaSelected = await element.$(`aria-selected="true"`);
    let selectedElement;
    let optionSelected;

    for (let elementWithId of elementsWithId) {
      if (selectedElement!==null) {
        let id = await getElementAttribute(elementWithId, "id");
        selectedElement = await element.$(`[aria-activedescendant="${id}"]`);
      }
    }

    if (name === 'select') {
      optionSelected = await element.$(`[selected]`);
    }

    if (selectedElement !== null)
      value = await getTrimmedText(elementsWithId[0]);
    else if (elementWithAriaSelected !== null) {
      value = await getTrimmedText(elementWithAriaSelected);
    } else if (optionSelected !== null) {
      value = await getTrimmedText(optionSelected);
    }
  } else if (role === "range" || role === "progressbar" || role === "scrollbar" || role === "slider" || role === "spinbutton"){
      let valueTextVar =  await getElementAttribute(element,"aria-valuetext");
      let valuenowVar = await getElementAttribute(element,"aria-valuenow");
    if (valueTextVar !== null)
      value = valueTextVar;
    else if (valuenowVar)
      value = valuenowVar;
  }

  return value;
}

export = getValueFromEmbeddedControl;
