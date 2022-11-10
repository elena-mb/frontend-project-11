import { uniqueId } from 'lodash';
import getNewPosts from './getNewPosts.js';
import UPDATE_TIMEOUT from './constants/constants.js';

const checkUpdates = (url, feedId, watchedState) => {
  const { pubDate: lastUpdate } = watchedState.posts.sort((a, b) => {
    const date1 = new Date(a.pubDate);
    const date2 = new Date(b.pubDate);
    return date2.getTime() - date1.getTime();
  })[0];
  getNewPosts(url, lastUpdate)
    .then((posts) => {
      if (posts.length < 1) return;
      const mappedPosts = posts.map((post) => {
        const id = uniqueId();
        return { feedId, id, ...post };
      });
      watchedState.posts.unshift(...mappedPosts);
    }).catch((e) => console.log(e));
  setTimeout(() => checkUpdates(url, feedId, watchedState), UPDATE_TIMEOUT);
};
export default checkUpdates;
