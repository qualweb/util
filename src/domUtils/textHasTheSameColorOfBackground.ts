function textHasTheSameColorOfBackground(element: typeof window.qwElement): boolean {
  const color = element.getComputedStyle('color', '');
  const background = element.getComputedStyle('background-color', '');
  const text = element.getText()?.trim();
  return color === background && !!text;
}

export default textHasTheSameColorOfBackground;
