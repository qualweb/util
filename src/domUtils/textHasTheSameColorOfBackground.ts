function textHasTheSameColorOfBackground(element: typeof window.qwElement): boolean {
  const color = element.getComputedStyle('color', '');
  const background = element.getComputedStyle('background-color', '');
  let text = element.getText();
  if (text) {
    text = text.trim();
  }
  return color === background && !!text;
}

export default textHasTheSameColorOfBackground;
