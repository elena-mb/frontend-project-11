import axios from 'axios';

const getRoute = (url) => {
  const result = new URL('/get', 'https://allorigins.hexlet.app');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', 'true');
  return result.toString();
};

export default (uri) => (axios(getRoute(uri))
  // .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(uri)}`)
  .then((response) => {
    const { contents, status: { content_type: contentType } } = response.data;
    console.log('response: ', JSON.stringify(response));
    if (!contentType.includes('application/rss+xml')) {
      const error = {
        errors: [{ key: 'ERR_INVALID_RSS' }],
      };
      throw error;
    }
    return { url: uri, contents };
  }))
  .catch((e) => {
    console.log('error from fetch: ', JSON.stringify(e));
    const error = {
      errors: [{ key: 'ERR_INVALID_RSS' }],
    };
    throw error;
  });
