import i18n from './i18n.js';
import setInnerText from './utils/setInnerText.js';

export default () => {
  const selectorsMatched = {
    h1: 'HEADER',
    'p.lead': 'ABOUT',
    'label[for="url-input"]': 'INPUT_LABEL',
    'button[aria-label="add"]': 'ADD_BTN',
    '#example': 'EXAMPLE',
    '#credits': 'CREDITS',
    'a.full-article': 'READ',
    'button#close-modal': 'CLOSE_MODAL',
  };
  Object.entries(selectorsMatched).map(([selecor, key]) => setInnerText(selecor, key));
  document.querySelector('#url-input').setAttribute('placeholder', i18n.t('INPUT_LABEL'));
};
