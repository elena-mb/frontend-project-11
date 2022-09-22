import axios from 'axios';

const getRoute = (url) => {
  const result = new URL('/get', 'https://allorigins.hexlet.app');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', 'true');
  console.log(result.toString());
  return result.toString();
};

export default (uri) => (axios.get(getRoute(uri))
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
  }));
// .catch((e) => {
//   console.log('error from fetch: ', JSON.stringify(e));
//   const error = {
//     errors: [{ key: 'ERR_INVALID_RSS' }],
//   };
//   throw error;
// });
