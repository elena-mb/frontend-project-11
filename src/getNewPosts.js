import fetchFeed from './fetchFeed.js';
import parseFeed from './parseFeed.js';

export default (url, lastUpdate) => fetchFeed(url)
  .then(({ contents }) => parseFeed(contents))
  .then(({ posts }) => {
    const newPosts = posts.filter(({ pubDate }) => pubDate > lastUpdate);
    return newPosts;
  }).catch((e) => e);
