// import axios from 'axios';
import onChange from 'on-change';
import { uniqueId } from 'lodash';
import parseFeed from './parseFeed.js';
import fetchFeed from './fetchFeed.js';
import validateUrl from './utils/validateUrl.js';
import getNewPosts from './getNewPosts.js';
import render from './view.js';

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
        const checkUpdates = () => {
          const lastUpdate = state.posts[0].pubDate;
          getNewPosts(url, lastUpdate)
            .then((posts) => {
              if (posts.length < 1) return;
              const mappedPosts = posts.map((post) => {
                const id = uniqueId();
                return { feedId, id, ...post };
              });
              watchedState.posts.unshift(...mappedPosts);
            }).catch((e) => console.log(e));
          setTimeout(checkUpdates, 3000);
        };
        setTimeout(checkUpdates, 3000);
      });
    }
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

    const handleError = (err) => {
      watchedState.rssForm.state = 'invalid';
      watchedState.rssForm.error = err;
    };

    const handleLoading = () => {
      watchedState.rssForm.state = 'loading';
    };

    const handleSuccess = (url) => {
      watchedState.rssForm.inputValue = '';
      watchedState.rssForm.state = 'valid';
      watchedState.rssForm.error = null;
      watchedState.feedList.push({ url, feedId: uniqueId() });
    };

    const addedFeeds = feedList.map(({ url }) => url);
    validateUrl(inputValue, addedFeeds)
      .then((url) => {
        handleLoading();
        return fetchFeed(url);
      })
      .then(({ url, contents }) => {
        handleSuccess(url);
        return parseFeed(contents, url);
      })
      .then(({ feed, posts }) => {
        const { feedId } = state.feedList.find(({ url }) => feed.url === url);
        const mappedPosts = posts.map((post) => ({ feedId, id: uniqueId(), ...post }));
        watchedState.feeds.push({ id: feedId, ...feed });
        watchedState.posts.push(...mappedPosts);
      })
      .catch((e) => {
        console.log(e);
        if (e.code === 'ERR_NETWORK') {
          const error = { key: e.code };
          handleError(error);
        } else {
          const [error] = e.errors.map(({ key }) => ({ key }));
          handleError(error);
        }
      });
  };

  input.addEventListener('input', handleInputChange);
  form.addEventListener('submit', handleSubmit);
};
