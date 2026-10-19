(function () {
  'use strict';

  var OFFERS_URL = 'https://rekrutacja.webdeveloper.rtbhouse.net/files/banner.json';
  var OFFERS_COUNT = 3;
  var INTERVAL_MS = 3000;
  var CURRENCY_SYMBOLS = { PLN: 'zł' };

  var banner = document.getElementById('banner160_banner');
  var track = document.getElementById('banner160_track');
  var closeBtn = document.getElementById('banner160_close');

  var slidesCount = 0;
  var activeIndex = 0;

  // Whole banner is clickable and opens the ad server's clickTag
  function openClickTag() {
    window.open(window.clickTag, '_blank');
  }

  function formatPrice(price, currency) {
    var parts = Number(price).toFixed(2).split('.');
    var integer = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
    var symbol = CURRENCY_SYMBOLS[currency] || currency;
    return integer + ',' + parts[1] + '\u00a0' + symbol;
  }

  function createOffer(offer) {
    var el = document.createElement('div');
    el.className = 'banner160-offer';

    var img = document.createElement('img');
    img.className = 'banner160-offer__img';
    img.src = offer.imgURL;
    img.alt = offer.name;

    var name = document.createElement('p');
    name.className = 'banner160-offer__name';
    name.textContent = offer.name;

    var price = document.createElement('p');
    price.className = 'banner160-offer__price';
    price.textContent = formatPrice(offer.price, offer.currency);

    var button = document.createElement('button');
    button.className = 'banner160-offer__button';
    button.type = 'button';
    button.textContent = 'Check';

    el.appendChild(img);
    el.appendChild(name);
    el.appendChild(price);
    el.appendChild(button);

    return el;
  }

  function goTo(index) {
    activeIndex = index;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
  }

  function next() {
    goTo((activeIndex + 1) % slidesCount);
  }

  function render(offers) {
    offers.slice(0, OFFERS_COUNT).forEach(function (offer) {
      track.appendChild(createOffer(offer));
    });

    slidesCount = track.children.length;
    if (slidesCount > 1) setInterval(next, INTERVAL_MS);
  }

  banner.addEventListener('click', openClickTag);

  closeBtn.addEventListener('click', function (e) {
    // Closing must not count as an ad click
    e.stopPropagation();
    banner.style.display = 'none';
  });

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
