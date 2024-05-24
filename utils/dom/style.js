const getCssVar = (element = document.body, property = "") => {
  return window.getComputedStyle(element, null).getPropertyValue(property);
};

export { getCssVar };
  