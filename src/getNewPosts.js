import fetchFeed from './fetchFeed.js';
import parseFeed from './parseFeed.js';

export default (url, lastUpdate) => fetchFeed(url)
  .then(({ contents }) => parseFeed(contents))
  .then(({ posts }) => {
    const newPosts = posts.filter(({ pubDate }) => {
      const lastDate = new Date(lastUpdate);
      const currDate = new Date(pubDate);
      return currDate.getTime() > lastDate.getTime();
    });
    return newPosts;
  });
