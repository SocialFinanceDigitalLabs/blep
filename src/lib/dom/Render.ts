const Render = (element: Element, component: Element) => {
  //unbind and destroy any event handlers on element
  const newElement = element.cloneNode(false);
  element.replaceWith(newElement);

  //dump child in
  newElement.appendChild(component);

  return newElement as Element;
};

export default Render;
