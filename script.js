(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('[data-slideshow]').forEach(function (show) {
    var track = show.querySelector('.slides');
    var total = track.children.length;
    if (total < 2) return;

    var idx = 0;
    var timer = null;
    var cur = show.querySelector('.cur');

    function go(i) {
      idx = (i + total) % total;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      if (cur) cur.textContent = idx + 1;
    }

    function auto() {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { go(idx + 1); }, 2500);
    }

    var prev = show.querySelector('.prev');
    var next = show.querySelector('.next');
    if (prev) prev.addEventListener('click', function () { go(idx - 1); auto(); });
    if (next) next.addEventListener('click', function () { go(idx + 1); auto(); });

    show.addEventListener('mouseenter', function () { clearInterval(timer); });
    show.addEventListener('mouseleave', auto);

    // swipe on touch devices
    var startX = null;
    show.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      clearInterval(timer);
    }, { passive: true });
    show.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      startX = null;
      auto();
    });

    auto();
  });

})();

/* contact form: submit via fetch so the visitor stays on the page */
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var note = document.querySelector('.form-note');
  var button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', function (e) {
    if (form.getAttribute('action').indexOf('formspree.io') === -1) return;
    e.preventDefault();
    button.disabled = true;
    button.textContent = '보내는 중...';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('failed');
      form.hidden = true;
      if (note) note.hidden = false;
    }).catch(function () {
      button.disabled = false;
      button.textContent = '보내기 / Send';
      if (note) {
        note.textContent = '전송에 실패했습니다. contact@kimyongjin.kr 로 직접 보내주세요.';
        note.hidden = false;
      }
    });
  });
})();
