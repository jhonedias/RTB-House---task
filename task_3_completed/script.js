(function () {
  'use strict';

  var ENDED_MESSAGE = 'Promotion ended.';

  var textEl = document.getElementById('countdown_text');

  var endDate = getEndOfWeek(new Date());
  var timerId = null;

  function getEndOfWeek(date) {
    var end = new Date(date);
    var daysToSunday = (7 - end.getDay()) % 7;
    end.setDate(end.getDate() + daysToSunday);
    end.setHours(23, 59, 59, 0);
    return end;
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function formatTime(totalSeconds) {
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;
    return [days, hours, minutes, seconds].map(pad).join('-');
  }

  function tick() {
    var remaining = Math.floor((endDate - Date.now()) / 1000);

    if (remaining < 0) {
      textEl.textContent = ENDED_MESSAGE;
      clearInterval(timerId);
      return;
    }

    textEl.textContent = 'Time remaining: ' + formatTime(remaining);
  }

  timerId = setInterval(tick, 1000);
  tick();
})();
