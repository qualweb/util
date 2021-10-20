function elementIdIsReferenced(element: typeof window.qwElement, id: string, attribute: string): boolean {
  let result: boolean;
  try {
    result = window.qwPage.find('[' + attribute + `="${id}"]`, element) !== null;
  } catch {
    result = false;
  }
  return result;
}

export default elementIdIsReferenced;
