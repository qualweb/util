function getDefaultName(element: typeof window.qwElement): string {
  let name = element.getTagName();
  if (!name) name = '';
  let type: string | null = null;
  let result = '';

  if (name === 'input') {
    type = element.getAttribute('type');
  }

  // TODO: verificar duplicação
  if (type === 'submit') {
    result = 'Reset';
  } else if (type === 'reset') {
    result = 'Reset';
  }

  return result;
}

export default getDefaultName;
