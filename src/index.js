import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';

import markup from './js/templates/cards.hbs';
import axiosGet from './js/axios';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  laodMore: document.querySelector('.load-more'),
};

let page = 0;
let request = '';

refs.form.addEventListener('submit', onSubmit);
refs.laodMore.addEventListener('click', onLaodMore);
refs.gallery.addEventListener('click', onGalleryClick);

async function onSubmit(e) {
  e.preventDefault();
  resetRender();
  if (!e.currentTarget.elements.searchQuery.value.trim()) {
    return;
  }
  request = e.currentTarget.elements.searchQuery.value;
  page += 1;
  try {
    const response = await axiosGet(request, page);
    if (response.data.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderGallery(response.data.hits);
    if (response.data.totalHits > 40) {
      refs.laodMore.hidden = false;
    }
    Notify.success(`"Hooray! We found ${response.data.totalHits} images."`);
    lightbox();
  } catch (e) {
    console.log(e.message);
  }
}

async function onLaodMore() {
  try {
    page += 1;
    const response = await axiosGet(request, page);
    const quantity =
      document.querySelectorAll('.photo-card').length +
      response.data.hits.length;
    if (response.data.totalHits <= quantity) {
      refs.laodMore.hidden = true;
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    renderGallery(response.data.hits);
    lightbox();
    slowScroll();
  } catch (e) {
    console.log(e.message);
  }
}

function renderGallery(data) {
  refs.gallery.insertAdjacentHTML('beforeend', markup(data));
}

function resetRender() {
  refs.laodMore.hidden = true;
  page = 0;
  refs.gallery.innerHTML = '';
}

function onGalleryClick(evt) {
  evt.preventDefault();
}

function lightbox() {
  let lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
  });
  lightbox.refresh();
}

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.4,
    behavior: 'smooth',
  });
}
