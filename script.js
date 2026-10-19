(function () {
  'use strict';

  var OFFERS_URL = 'https://rekrutacja.webdeveloper.rtbhouse.net/files/banner_vip.json';
  var CITY_FONT_SIZE = 45;
  var COUNTRY_FONT_SIZE = 15;
  var MIN_FONT_SIZE = 10;
  var MAX_TEXT_WIDTH = 232;

  // Timeline (seconds)
  var FIRST_OFFER_AT = 2;
  var OFFER_HOLD = 3.4;
  var NEXT_OFFER_GAP = 0.75;

  var images = document.getElementById('bannervip_images');
  var stage = document.getElementById('bannervip_stage');
  var panel = document.getElementById('bannervip_panel');
  var logo = document.getElementById('bannervip_logo');
  var country = document.getElementById('bannervip_country');
  var countryText = document.getElementById('bannervip_country_text');
  var city = document.getElementById('bannervip_city');
  var cityText = document.getElementById('bannervip_city_text');
  var price = document.getElementById('bannervip_price');
  var priceLabel = document.getElementById('bannervip_price_label');
  var priceValue = document.getElementById('bannervip_price_value');
  var cta = document.getElementById('bannervip_cta');
  var line = document.getElementById('bannervip_line');
  var dotsEl = document.getElementById('bannervip_dots');
  var banner = document.getElementById('bannervip_banner');

  var offers = [];
  var imageEls = [];
  var dotEls = [];

  // Whole banner is clickable and opens the ad server's clickTag
  function openClickTag() {
    window.open(window.clickTag, '_blank');
  }

  // Static brand frame (yellow screen, logo and CTA) shown when the
  // offers or GSAP fail to load, so the banner is never left blank
  function showFallback() {
    [country, city, price, line, dotsEl].forEach(function (el) {
      el.style.display = 'none';
    });
    logo.style.top = '286px';
    stage.style.visibility = 'visible';
  }

  // Shrinks the font until the box fits (long names, up to 20 chars)
  function fitText(el, fontSize) {
    var size = fontSize;
    el.style.fontSize = size + 'px';
    while (el.offsetWidth > MAX_TEXT_WIDTH && size > MIN_FONT_SIZE) {
      size--;
      el.style.fontSize = size + 'px';
    }
  }

  function setOffer(index) {
    var offer = offers[index];
    countryText.textContent = offer.country;
    cityText.textContent = offer.city;
    priceLabel.textContent = offer.priceText;
    priceValue.textContent = offer.price + ' ' + offer.currency;
    fitText(country, COUNTRY_FONT_SIZE);
    fitText(city, CITY_FONT_SIZE);

    dotEls.forEach(function (dot, i) {
      dot.classList.toggle('bannervip-is-active', i === index);
    });
  }

  function render() {
    offers.forEach(function (offer) {
      var img = document.createElement('img');
      img.className = 'bannervip-image';
      img.src = offer.imgURL;
      img.alt = offer.city;
      imageEls.push(img);
      images.appendChild(img);

      var dot = document.createElement('div');
      dot.className = 'bannervip-dot';
      dotEls.push(dot);
      dotsEl.appendChild(dot);
    });

    setOffer(0);
  }

  // Entry: country and city boxes open left -> right,
  // city text and price rise from below
  function offerIn(tl, at) {
    tl.to(country, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.3, ease: 'power2.out' }, at)
      .to(city, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.2, ease: 'power2.out' }, at + 0.3)
      .to(countryText, { opacity: 1, duration: 0.2 }, at + 0.35)
      .to(price, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }, at + 0.45)
      .to(cityText, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, at + 0.6);
  }

  // Exit: city text and price leave upward,
  // country and city boxes close right -> left
  function offerOut(tl, at) {
    tl.to(countryText, { opacity: 0, duration: 0.1 }, at)
      .to(cityText, { yPercent: -100, duration: 0.25, ease: 'power2.in' }, at + 0.05)
      .to(price, { y: -15, opacity: 0, duration: 0.25, ease: 'power2.in' }, at + 0.05)
      .to(country, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.2, ease: 'power2.in' }, at + 0.2)
      .to(city, { clipPath: 'inset(0% 100% 0% 0%)', duration: 0.3, ease: 'power2.in' }, at + 0.25)
      // Reset below (hidden) so the next offer always enters from the bottom
      .set(cityText, { yPercent: 100 }, at + 0.55)
      .set(price, { y: 20 }, at + 0.55);
  }

  function animate() {
    var tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });

    // Initial state
    tl.call(setOffer, [0], 0)
      .set(stage, { opacity: 1, visibility: 'visible' }, 0)
      .set(panel, { yPercent: 100, left: 0, width: 300, height: 600 }, 0)
      .set(logo, { top: 286, x: -150 }, 0)
      .set(imageEls.slice(1), { xPercent: 100 }, 0)
      .set(country, { clipPath: 'inset(0% 100% 0% 0%)' }, 0)
      .set(city, { clipPath: 'inset(0% 100% 0% 0%)' }, 0)
      .set(countryText, { opacity: 0 }, 0)
      .set(cityText, { yPercent: 100 }, 0)
      .set(price, { x: 0, y: 20, opacity: 0 }, 0)
      .set(cta, { x: 220 }, 0)
      .set(line, { scaleX: 0, transformOrigin: 'left center' }, 0)
      .set(dotsEl, { opacity: 0 }, 0);

    // Intro: yellow screen, logo, then the screen shrinks into the logo box
    tl.to(panel, { yPercent: 0, duration: 0.35, ease: 'power2.out' }, 0)
      .to(logo, { x: 0, duration: 0.4, ease: 'power2.out' }, 0.4)
      .to(logo, { top: 19, duration: 0.5, ease: 'power2.inOut' }, 1)
      .to(panel, { height: 65, duration: 0.35, ease: 'power2.in' }, 1.45)
      .to(panel, { left: 34, width: 137, duration: 0.2, ease: 'power2.out' }, 1.8)
      .to(dotsEl, { opacity: 1, duration: 0.2 }, 1.6)
      .to(cta, { x: 0, duration: 0.35, ease: 'power2.out' }, FIRST_OFFER_AT + 0.4)
      .to(line, { scaleX: 1, duration: 0.3, ease: 'power2.out' }, FIRST_OFFER_AT + 0.5);

    // Offers
    var at = FIRST_OFFER_AT;
    offers.forEach(function (offer, i) {
      if (i > 0) {
        tl.to(imageEls[i], { xPercent: 0, duration: 0.25, ease: 'power2.inOut' }, at - 0.25)
          .call(setOffer, [i], at - 0.25);
      }
      offerIn(tl, at);
      offerOut(tl, at + OFFER_HOLD);
      at += OFFER_HOLD + NEXT_OFFER_GAP;
    });

    // Outro
    tl.to(stage, { opacity: 0, duration: 0.6 }, at - NEXT_OFFER_GAP + 0.2);
  }

  banner.addEventListener('click', openClickTag);

  fetch(OFFERS_URL)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      offers = data.offers || [];
      if (!offers.length || typeof gsap === 'undefined') {
        showFallback();
        return;
      }
      return Promise.all([
        document.fonts.load('400 45px Rubik'),
        document.fonts.load('700 25px Rubik')
      ]).then(function () {
        render();
        animate();
      });
    })
    .catch(function (err) {
      console.error('Could not load offers:', err);
      showFallback();
    });
})();
