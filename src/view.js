const changeInputStatus = (input, isValid) => {
  if (!isValid) {
    input.classList.add('is-invalid');
  } else {
    input.classList.remove('is-invalid');
  }
};

const showFeedback = (element, isSuccessful, message) => {
  if (isSuccessful) {
    element.classList.remove('text-danger');
    element.classList.add('text-success');
  } else {
    element.classList.remove('text-success');
    element.classList.add('text-danger');
  }
  // eslint-disable-next-line no-param-reassign
  element.textContent = message;
};

const render = (state) => {
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');

  const { input: { value, isValid, feedbackMessage } } = state;

  changeInputStatus(input, isValid);
  input.value = value;
  input.focus();

  showFeedback(feedback, isValid, feedbackMessage);
};

export default render;
