import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import fetchCountries from './fetchCountries.js';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener(
  'input',
  debounce(onSearchCountries, DEBOUNCE_DELAY)
);

function onSearchCountries(event) {
  const searchQuery = event.target.value.trim();

  fetchCountries(searchQuery).then(checkingInputVelue).catch(onFetchError);
}

function checkingInputVelue(data) {
  if (data.length > 1 && data.length <= 10) {
    createListMarkup(data);
  } else if (data.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length === 1) {
    createInfoMarkup(...data);
  } else {
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';
  }
}

function onFetchError() {
  refs.list.innerHTML = '';
  refs.info.innerHTML = '';
  Notify.failure('Oops, there is no country with that name');
}

function createListMarkup(country) {
  refs.info.innerHTML = '';
  const createMarkup = country
    .map(({ name, flags }) => {
      return `<li class='list-item'><img src="${flags.svg}" alt="${name.official}" width='40' class='img'>
  ${name.common}</li>`;
    })
    .join('');

  refs.list.innerHTML = createMarkup;
  addStyles();
}

function createInfoMarkup({ name, capital, population, languages, flags }) {
  refs.list.innerHTML = '';

  refs.info.innerHTML = `<h1 class='info-head'><img src="${flags.png}" alt="${
    name.oficial
  }" width='50' class='img'>${
    name.official
  }</h1><p><span class='bold-text'>Capital:</span> ${capital}</p><p><span class='bold-text'>Population:</span> ${population}</p><p><span class='bold-text'>Languages:</span> ${Object.values(
    languages
  )}</p>`;
  addStyles();
}
function addStyles() {
  const boldText = document.querySelectorAll('.bold-text');
  const listItems = document.querySelectorAll('.list-item');
  const img = document.querySelectorAll('.img');

  refs.list.style.listStyle = 'none';
  refs.list.style.display = 'flex';
  refs.list.style.flexDirection = 'column';
  refs.list.style.marginLeft = '-25px';

  for (const text of boldText) {
    text.style.fontWeight = 'bold';
  }

  for (const text of img) {
    text.style.marginRight = '5px';
  }

  for (const text of listItems) {
    text.style.display = 'flex';
    text.style.aligneItem = 'center';
    text.style.margin = '5px';
  }
}
