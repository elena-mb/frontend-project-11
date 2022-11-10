import i18n from '../i18n.js';

export default (selector, key) => {
  document.querySelector(selector).textContent = i18n.t(key);
};
