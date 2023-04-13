import './css/styles.css';
// import fetchCountries from './fetchCountries.js';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  console.log(event.target.value);
  fetchCountries(event.target.value);
}

function fetchCountries(name) {
  fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      createListMarkup(data);
    });
}

function createListMarkup(country) {
  const createMarkup = country
    .map(({ name, flags }) => {
      return `<li><svg>
  <use href="${flags.svg}"></use>
</svg>${name.common}</li>`;
    })
    .join('');

  refs.list.innerHTML = createMarkup;
}
