import 'bootstrap';
import { object, string } from 'yup';
import onChange from 'on-change';
import './style.scss';

const form = document.querySelector('form');
const input = document.querySelector('#url-input');
const feedback = document.querySelector('.feedback');

const state = {
  input: {
    value: '',
    isValid: true,
    errors: [],
  },
  feedList: [],
};

const watchedState = onChange(state, (path, value) => {
  if (path === 'input.isValid') {
    if (value === false) {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  } if (path === 'input.errors') {
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = value;
  } if (path === 'feedList') {
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'RSS успешно загружен';
  }
});

const urlSchema = object({
  url: string().url('Ссылка должна быть валидным URL').nullable().test({
    name: 'feed-already-added',
    skipAbsent: true,
    test(value, ctx) {
      if (state.feedList.includes(value)) {
        return ctx.createError({ message: 'RSS уже существует' });
      }
      return true;
    },
  }),
});

input.addEventListener('input', (e) => {
  const { value } = e.target;
  watchedState.input.value = value;
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const { value } = state.input;
  const promise = new Promise((resolve) => {
    resolve(urlSchema.validate({ url: value }));
  });
  promise.then(({ url }) => {
    watchedState.input.value = '';
    watchedState.input.isValid = true;
    watchedState.input.errors = [];
    watchedState.feedList.push(url);
    // console.log(state);
    input.value = watchedState.input.value;
    input.focus();
  })
    .catch((err) => {
      console.log('error!');
      watchedState.input.isValid = false;
      watchedState.input.errors = err.message;
      // console.log(state);
    });
  // console.log('submit:', promise);
});
// console.log('hi from js!');
