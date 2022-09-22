import i18n from './i18n.js';
import createElement from './utils/createElement.js';

export default (state) => {
  const {
    rssForm: {
      inputValue,
      error,
      state: formState,
    },
    feeds,
    posts,
  } = state;

  const modal = document.querySelector('#modal');
  const input = document.querySelector('#url-input');
  const feedback = document.querySelector('.feedback');
  const submitBtn = document.querySelector('button[type="submit"]');
  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  const handleLoading = () => {
    if (formState === 'loading') {
      submitBtn.disabled = true;
    } else {
      submitBtn.disabled = false;
    }
  };

  const renderFeedback = () => {
    const message = formState === 'valid'
      ? i18n.t('SUCCESS_MESSAGE')
      : i18n.t(error?.key) ?? '';

    if (formState === 'valid') {
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
    } else if (formState === 'invalid') {
      feedback.classList.remove('text-success');
      feedback.classList.add('text-danger');
    }

    feedback.textContent = message;
  };

  const renderInput = () => {
    if (formState === 'invalid') {
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
    input.value = inputValue;
    input.focus();
  };

  const renderFeeds = () => {
    if (feeds.length === 0) return;
    const card = createElement('div', ['card', 'border-0']);

    const cardBody = createElement('div', ['card-body']);
    const cardTitle = createElement('div', ['card-title', 'h4'], i18n.t('feeds'));
    cardBody.appendChild(cardTitle);

    const list = createElement('ul', ['list-group', 'border-0', 'rounded-0']);

    feeds.forEach(({ title, description }) => {
      const liElement = createElement('li', ['list-group-item', 'border-0', 'border-end-0']);
      const header = createElement('h3', ['h6', 'm-0'], title);
      const about = createElement('p', ['m-0', 'small', 'text-black-50'], description);
      liElement.appendChild(header);
      liElement.appendChild(about);
      list.appendChild(liElement);
    });
    cardBody.appendChild(list);
    card.appendChild(cardBody);
    feedsContainer.replaceChildren(card);
  };

  const renderPosts = () => {
    if (posts.length === 0) return;
    const card = createElement('div', ['card', 'border-0']);

    const cardBody = createElement('div', ['card-body']);
    const cardTitle = createElement('div', ['card-title', 'h4'], i18n.t('posts'));
    cardBody.appendChild(cardTitle);

    const list = createElement('ul', ['list-group', 'border-0', 'rounded-0']);

    posts.forEach(({
      title,
      link,
      id, /* pubDate, feedId, description */
    }) => {
      const liElement = createElement('li', [
        'list-group-item',
        'd-flex',
        'justify-content-between',
        'align-items-start',
        'border-0',
        'border-end-0']);
      const postName = createElement('a', ['fw-bold'], title, {
        href: link,
        'data-id': id,
        target: '_blank',
        rel: 'noopener noreferrer',
      });
      postName.addEventListener('click', () => {
        // postName.setAttribute('visited', true);
        postName.classList.remove('fw-bold');
        postName.classList.add('fw-normal', 'link-secondary');
      });
      const button = createElement('button', [
        'btn',
        'btn-outline-primary',
        'btn-sm'], i18n.t('showMore'), {
        'data-id': id,
        'data-bs-toggle': 'modal',
        'data-bs-target': '#modal',
      });
      button.addEventListener('click', () => {
        postName.classList.remove('fw-bold');
        postName.classList.add('fw-normal', 'link-secondary');
      }); // after rerendering these classes change back. fix it !!!
      liElement.appendChild(postName);
      liElement.appendChild(button);
      list.appendChild(liElement);
    });
    cardBody.appendChild(list);
    card.appendChild(cardBody);
    postsContainer.replaceChildren(card);
  };

  modal.addEventListener('show.bs.modal', (e) => {
    const { id } = e.relatedTarget.dataset;
    const { title, description, link } = posts.find(({ id: postId }) => id === postId);
    modal.querySelector('.modal-title').textContent = title;
    modal.querySelector('.modal-body').textContent = description;
    modal.querySelector('.full-article').setAttribute('href', link);
  });

  handleLoading();
  renderInput();
  renderFeedback();
  renderFeeds();
  renderPosts();
};
