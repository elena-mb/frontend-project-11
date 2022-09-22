import { string, setLocale } from 'yup';

export default (value, forbiddenValues) => new Promise((resolve) => {
  setLocale({
    mixed: {
      notOneOf: () => ({ key: 'ERR_CONFLICT' }),
    },
    string: {
      url: () => ({ key: 'ERR_INVALID_URL' }),
    },
  });
  const urlScema = string()
    .url()
    .notOneOf(forbiddenValues);

  resolve(urlScema.validate(value));
});
