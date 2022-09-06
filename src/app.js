import { string } from 'yup';
import onChange from 'on-change';
import render from './view.js';
import {
  INPUT_ERR_CONFLICT,
  INPUT_ERR_INVALID,
} from './constants/constants.js';

export default () => {
  const state = {
    rssForm: {
      inputValue: '',
      state: 'filling', // filling, valid, invalid,
      error: null,
    },
    feedList: [],
  };

  const watchedState = onChange(state, () => {
    render(state);
  });

  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');

  const handleInputChange = (event) => {
    watchedState.rssForm.inputValue = event.target.value;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const { feedList, rssForm: { inputValue } } = state;

    const validate = (value) => new Promise((resolve) => {
      const urlScema = string()
        .url(INPUT_ERR_INVALID)
        .notOneOf(feedList, INPUT_ERR_CONFLICT);

      resolve(urlScema.validate(value));
    });

    const handleSuccess = (url) => {
      watchedState.rssForm.inputValue = '';
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.error = null;
      watchedState.feedList.push(url);
    };

    const handleError = (err) => {
      watchedState.rssForm.state = 'invalid';
      watchedState.rssForm.error = err;
    };

    validate(inputValue).then((url) => {
      handleSuccess(url);
    }).catch((e) => {
      handleError(e);
    });
  };

  input.addEventListener('input', handleInputChange);
  form.addEventListener('submit', handleSubmit);
};
