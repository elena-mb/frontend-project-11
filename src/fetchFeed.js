import axios from 'axios';

export default (uri) => (axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(uri)}`)
  .then(({ data }) => {
    const { contents, status: { content_type: contentType } } = data;
    if (!contentType.includes('application/rss+xml')) {
      const error = {
        errors: [{ key: 'ERR_INVALID_RSS' }],
      };
      throw error;
    }
    return { url: uri, contents };
  }))
  .catch(() => {
    const error = {
      errors: [{ key: 'ERR_INVALID_RSS' }],
    };
    throw error;
  });
