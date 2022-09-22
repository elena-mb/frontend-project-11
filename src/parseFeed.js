export default (contentsXML, url) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(contentsXML, 'text/xml');
  const feedTitle = doc.querySelector('title').textContent;
  const feedDescription = doc.querySelector('description').textContent;
  const items = doc.querySelectorAll('item');
  const posts = [];
  items.forEach((item) => {
    const title = item.querySelector('title').textContent;
    const description = item.querySelector('description').textContent;
    const link = item.querySelector('link').textContent;
    const pubDate = item.querySelector('pubDate').textContent;
    posts.push({
      title,
      description,
      link,
      pubDate,
    });
  });
  return {
    feed: {
      url,
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  };
};
