import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '30765705-c14899d15262e44858655656a';
const searchOptions = {
  imageType: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  perPage: 40,
};

export default function axiosGet(request, page) {
  return axios.get(
    `${BASE_URL}?key=${KEY_API}&q=${request}&image_type=${searchOptions.imageType}&orientation=${searchOptions.orientation}&safesearch=${searchOptions.safesearch}&per_page=${searchOptions.perPage}&page=${page}`
  );
}
