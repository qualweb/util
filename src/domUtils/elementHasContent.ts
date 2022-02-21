import { alwaysNotVisible, needsControls, alwaysVisible, needsOpen } from './constants';
import textHasTheSameColorOfBackground from './textHasTheSameColorOfBackground';

function elementHasContent(element: typeof window.qwElement, checkChildren: boolean): boolean {
  let result = false;
  const name = element.getTagName();
  if (alwaysNotVisible.includes(name)) {
    //Do nothing (dont delete)
  } else if (needsControls.includes(name)) {
    const controls = element.getProperty('controls');
    result = !!controls;
  } else if (needsOpen.includes(name)) {
    const open = element.getProperty('open');
    result = !!open;
  } else if (alwaysVisible.includes(name)) {
    result = true;
  } else {
    const textHasTheSameColor = textHasTheSameColorOfBackground(element);
    let text = element.getText();
    if (text) {
      text = text.trim();
      result = text !== '' && !textHasTheSameColor;
    }
  }
  const childrenVisible = false;
  if (checkChildren) {
    const children = element.getChildren();
    for (const child of children) {
      checkChildren = childrenVisible || elementHasContent(child, checkChildren);
    }
  }
  return result || checkChildren;
}

export default elementHasContent;
