import axios from 'axios';

const getRoute = (url) => {
  const result = new URL('/get', 'https://allorigins.hexlet.app');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', 'true');
  return result.toString();
};

export default (link) => (axios.get(getRoute(link))
  .then(({ data }) => {
    const { contents } = data;
    if (!contents.includes('xml')) {
      const error = {
        errors: [{ key: 'ERR_INVALID_RSS' }],
      };
      throw error;
    }
    return { url: link, contents };
  }));
