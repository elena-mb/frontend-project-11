export default (element, classes = [], textContent = '', attributes = {}) => {
  const el = document.createElement(element);
  el.classList.add(...classes);
  el.textContent = textContent;
  Object.entries(attributes).forEach(([key, value]) => {
    el.setAttribute(key, value);
  });
  return el;
};
