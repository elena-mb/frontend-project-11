import onChange from 'on-change';
import validateUrl from './utils/validateUrl.js';
import render from './view.js';

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

    validateUrl(inputValue, feedList).then((url) => {
      handleSuccess(url);
    }).catch((e) => {
      const [error] = e.errors.map(({ key }) => ({ key }));
      handleError(error);
    });
  };

  input.addEventListener('input', handleInputChange);
  form.addEventListener('submit', handleSubmit);
};
