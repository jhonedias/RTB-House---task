(function () {
  'use strict';

  var OFFERS_URL = 'https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json';
  var OFFERS_COUNT = 4;
  var INTERVAL_MS = 2000;
  var CURRENCY_SYMBOLS = { PLN: 'zł' };

  var banner = document.getElementById('banner300_banner');
  var offersEl = document.getElementById('banner300_offers');
  var frame = document.getElementById('banner300_frame');

  var offerEls = [];
  var activeIndex = 0;
  var timerId = null;

  // Whole banner is clickable and opens the ad server's clickTag
  function openClickTag() {
    window.open(window.clickTag, '_blank');
  }

  function formatPrice(price, currency) {
    var parts = Number(price).toFixed(2).split('.');
    var integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    var symbol = CURRENCY_SYMBOLS[currency] || currency;
    return integer + ',' + parts[1] + ' ' + symbol;
  }

  function createOffer(offer, index) {
    var el = document.createElement('div');
    el.className = 'banner300-offer';
    el.title = offer.name;

    var img = document.createElement('img');
    img.className = 'banner300-offer__img';
    img.src = offer.imgURL;
    img.alt = offer.name;

    var price = document.createElement('span');
    price.className = 'banner300-offer__price';
    price.textContent = formatPrice(offer.price, offer.currency);

    el.appendChild(img);
    el.appendChild(price);

    el.addEventListener('mouseenter', function () {
      setActive(index);
    });

    return el;
  }

  function setActive(index) {
    activeIndex = index;
    var target = offerEls[index];
    frame.style.width = target.offsetWidth + 'px';
    frame.style.height = target.offsetHeight + 'px';
    frame.style.transform =
      'translate(' + target.offsetLeft + 'px, ' + target.offsetTop + 'px)';
    frame.classList.add('banner300-is-visible');
  }

  function next() {
    setActive((activeIndex + 1) % offerEls.length);
  }

  function start() {
    stop();
    timerId = setInterval(next, INTERVAL_MS);
  }

  function stop() {
    clearInterval(timerId);
    timerId = null;
  }

  function render(offers) {
    offers.slice(0, OFFERS_COUNT).forEach(function (offer, i) {
      var el = createOffer(offer, i);
      offerEls.push(el);
      offersEl.appendChild(el);
    });

    if (!offerEls.length) return;

    setActive(0);
    start();

    banner.addEventListener('mouseenter', stop);
    banner.addEventListener('mouseleave', start);
  }

  banner.addEventListener('click', openClickTag);

  fetch(OFFERS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      render(data.offers || []);
    })
    .catch(function (err) {
      console.error('Could not load offers:', err);
    });
})();
