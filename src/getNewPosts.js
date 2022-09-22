import fetchFeed from './fetchFeed.js';
import parseFeed from './parseFeed.js';

export default (url, lastUpdate) => fetchFeed(url)
  .then(({ contents }) => parseFeed(contents))
  .then(({ posts }) => {
    const newPosts = posts.filter(({ pubDate }) => pubDate > lastUpdate);
    //   .map((post) => {
    //     const id = uniqueId();
    //     return { feedId, id, ...post };
    //   });
    // watchedState.posts.unshift(...newPosts);
    // console.log(newPosts, 'from check');
    return newPosts;
  }).catch((e) => e);
