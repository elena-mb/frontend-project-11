import i18n from './i18n.js';

export default (state) => {
  const {
    rssForm: {
      inputValue,
      error,
      state: formState,
    },
  } = state;

  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  const renderFeedback = () => {
    const message = formState === 'valid'
      ? i18n.t('success_message')
      : i18n.t(error?.key) ?? '';

    if (formState === 'valid') {
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
    } else if (formState === 'invalid') {
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }

    feedback.textContent = message;
  };

  const renderInput = () => {
    if (formState === 'invalid') {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
    input.value = inputValue;
    input.focus();
  };

  renderInput();
  renderFeedback();
};
