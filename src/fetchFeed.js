import axios from 'axios';

const getRoute = (url) => {
  const result = new URL('/get', 'https://allorigins.hexlet.app');
  result.searchParams.set('url', url);
  result.searchParams.set('disableCache', 'true');
  console.log(result.toString());
  return result.toString();
};

export default (link) => (axios.get(getRoute(link)) // error happens here ??
  .then(({ data }) => {
    console.log('response: ', data);
    const { contents } = data;
    // console.log('response: ', JSON.stringify(response));
    if (!contents.includes('xml')) {
      const error = {
        errors: [{ key: 'ERR_INVALID_RSS' }],
      };
      throw error;
    }
    return { url: link, contents };
  }))
  .catch((e) => {
    console.log('error from fetch: ', e);
    const error = {
      errors: [{ key: 'ERR_INVALID_RSS' }],
    };
    throw error;
  });
