import './css/styles.css';
import { Notify } from 'notiflix';
import markup from './js/templates/cards.hbs';
import axiosGet from './js/axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  laodMore: document.querySelector('.load-more'),
};

let page = 0;
let request = '';

refs.form.addEventListener('submit', onSubmit);
refs.laodMore.addEventListener('click', onLaodMore);

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
    }
    renderGallery(response.data.hits);
    if (response.data.totalHits > 40) {
      refs.laodMore.hidden = false;
    }
    Notify.success(`"Hooray! We found ${response.data.totalHits} images."`);
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

async function onLaodMore() {
  try {
    page += 1;
    const response = await axiosGet(request, page);
    const quantity =
      document.querySelectorAll('.photo-card').length +
      response.data.hits.length;
    console.log(quantity);
    if (response.data.totalHits <= quantity) {
      refs.laodMore.hidden = true;
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    renderGallery(response.data.hits);
  } catch (e) {
    console.log(e.message);
  }
}
