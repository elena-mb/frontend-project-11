import axios from 'axios';

export default (uri) => (axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(uri)}`)
  .then((response) => {
    const { contents, status: { content_type: contentType } } = response.data;
    console.log(JSON.stringify(response));
    if (!contentType.includes('application/rss+xml')) {
      const error = {
        errors: [{ key: 'ERR_INVALID_RSS' }],
      };
      throw error;
    }
    return { url: uri, contents };
  }))
  .catch((e) => {
    console.log(JSON.stringify(e));
    const error = {
      errors: [{ key: 'ERR_INVALID_RSS' }],
    };
    throw error;
  });
