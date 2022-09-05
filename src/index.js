import 'bootstrap';
import { string } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import './style.scss';

const app = () => {
  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');

  const state = {
    input: {
      value: '',
      isValid: true,
      error: {},
      feedbackMessage: '',
    },
    feedList: [],
  };

  const watchedState = onChange(state, () => {
    render(state);
  });

  const handleInputChange = ({ target: { value } }) => {
    watchedState.input.value = value;
  };

  const handleSuccess = (url) => {
    watchedState.input.value = '';
    watchedState.input.isValid = true;
    watchedState.input.error = {};
    watchedState.input.feedbackMessage = 'RSS успешно загружен';
    watchedState.feedList.push(url);
  };

  const handleError = (err) => {
    watchedState.input.isValid = false;
    watchedState.input.error = err;
    watchedState.input.feedbackMessage = err.message;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { feedList, input: { value } } = state;

    const validate = (str) => new Promise((resolve) => {
      const urlScema = string()
        .url('Ссылка должна быть валидным URL')
        .notOneOf(feedList, 'RSS уже существует');

      resolve(urlScema.validate(str));
    });

    validate(value).then((url) => {
      handleSuccess(url);
    }).catch((e) => {
      handleError(e);
    });
  };

  input.addEventListener('input', handleInputChange);

  form.addEventListener('submit', handleSubmit);
};

app();
