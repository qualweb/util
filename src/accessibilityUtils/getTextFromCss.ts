function getTextFromCss(element: typeof window.qwElement, textContent: string): string {
  const before = element.getComputedStyle('computed-style-before', 'content');
  const after = element.getComputedStyle('computed-style-after', 'content');

  return before + textContent + after;
}

export default getTextFromCss;
