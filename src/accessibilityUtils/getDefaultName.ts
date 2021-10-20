function getDefaultName(element: typeof window.qwElement): string {
  let name = element.getTagName();
  if (!name) name = '';
  let type;
  let result = '';

  if (name === 'input') {
    type = element.getAttribute('type');
  }

  /*if (type === "image") {
    result = "image";
  } */ if (type === 'submit') {
    result = 'Reset';
  } else if (type === 'reset') {
    result = 'Reset';
  }

  return result;
}

export default getDefaultName;
