import i18next from 'i18next';
import resources from './locales/index.js';

const i18n = i18next.createInstance();
i18n.init({
  lng: 'ru',
  debug: true,
  resources,
});

export default i18n;
