import { string, setLocale } from 'yup';

export default (value, forbiddenValues) => new Promise((resolve) => {
  setLocale({
    mixed: {
      notOneOf: () => ({ key: 'err_conflict' }),
    },
    string: {
      url: () => ({ key: 'err_invalid' }),
    },
  });
  const urlScema = string()
    .url()
    .notOneOf(forbiddenValues);

  resolve(urlScema.validate(value));
});
