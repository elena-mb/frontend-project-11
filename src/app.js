import onChange from 'on-change';
import { uniqueId } from 'lodash';
import parseFeed from './parseFeed.js';
import fetchFeed from './fetchFeed.js';
import validateUrl from './utils/validateUrl.js';
import checkUpdates from './checkUpdates.js';
import render from './view.js';
import init from './init.js';
import UPDATE_TIMEOUT from './constants/constants.js';

export default () => {
  const state = {
    rssForm: {
      inputValue: '',
      state: 'filling', // filling, valid, invalid, loading
      error: null,
    },
    feedList: [],
    feeds: [],
    posts: [],
  };

  const watchedState = onChange(state, (path) => {
    if (path === 'rssForm.inputValue') return;
    if (path === 'feedList') {
      state.feedList.forEach(({ url, feedId }) => {
        setTimeout(() => checkUpdates(url, feedId, watchedState), UPDATE_TIMEOUT);
      });
    }
    render(state);
  });

  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');
  const example = document.querySelector('#example-link');

  const handleInputChange = (event) => {
    watchedState.rssForm.inputValue = event.target.value;
  };

  const handleSubmit = (event) => {
    const handleSubmitError = (err) => {
      watchedState.rssForm.state = 'invalid';
      watchedState.rssForm.error = err;
    };

    const handleSubmitLoading = () => {
      watchedState.rssForm.state = 'loading';
    };

    const handleSubmitSuccess = (url) => {
      watchedState.rssForm.inputValue = '';
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.error = null;
      watchedState.feedList.push({ url, feedId: uniqueId() });
    };

    const { feedList, rssForm: { inputValue } } = state;
    const addedFeeds = feedList.map(({ url }) => url);

    event.preventDefault();
    validateUrl(inputValue.trim(), addedFeeds)
      .then((url) => {
        handleSubmitLoading();
        return fetchFeed(url);
      })
      .then(({ url, contents }) => {
        handleSubmitSuccess(url);
        return parseFeed(contents, url);
      })
      .then(({ feed, posts }) => {
        const { feedId } = state.feedList.find(({ url }) => feed.url === url);
        const mappedPosts = posts.map((post) => ({ feedId, id: uniqueId(), ...post }));
        watchedState.feeds.push({ id: feedId, ...feed });
        watchedState.posts.push(...mappedPosts);
      })
      .catch((e) => {
        if (e.code === 'ERR_NETWORK') {
          const error = { key: e.code };
          handleSubmitError(error);
        } else {
          const [error] = e.errors.map(({ key }) => ({ key }));
          handleSubmitError(error);
        }
      });
  };

  const handleExampleClick = (e) => {
    e.preventDefault();
    const url = e.target.innerText;
    input.value = url;
    watchedState.rssForm.inputValue = url;
    input.focus();
  };

  init();
  input.addEventListener('input', handleInputChange);
  form.addEventListener('submit', handleSubmit);
  example.addEventListener('click', handleExampleClick);
};
